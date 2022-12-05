/* DATA LOADING */
async function loadData() {
    const dataset_array = []
    let logos = []
    logos = await d3.json('data/cfb_logos.json')
    for (let i = 13; i < 21; i++) {

        path = `data/TeamStats/cfb${i}.csv`
        let dataset = await d3.csv(path);

        // clean the imported csv data
        //cleanDataFrame(dataset);

        // Index column in cfb21 needs to be removed
        if (i == 21) {
            dataset.columns.splice(0, 1);
        }

        // append dataset to collection
        dataset_array.push(dataset);
    }


    // returns 9 len array, each element is full dataset from one season
    return [logos, dataset_array];
}


const tableState = {
    // data the table is drawing, could be filtered
    drawData: null,
    // unfiltered current season dataset
    tableData: null,

    // unsure if these two are neccessary at the moment
    seasonalData: null,
    //defaultTableData: null,
}


const globalApplicationState = {
    // current state of the table
    tableState: null,

    // full set of 9 seasons of data
    data: null,
    teamMap: null,
    histogram: null,

};

loadData().then((dataA) => {
    loadedData = dataA[1]
    loadedData.forEach(function (dataFrame) {
        cleanDataFrame(dataFrame)
    })

    globalApplicationState.data = loadedData

    // get team data across all 9 seasons into map
    globalApplicationState.teamMap = groupByTeam(loadedData);
    globalApplicationState.missingTeamData = formatYearColumn(globalApplicationState.teamMap);
    globalApplicationState.teamMap.columns = loadedData.columns;
    globalApplicationState.chartData = parseStats(globalApplicationState.teamMap);
    globalApplicationState.logos = logoDataStructure(globalApplicationState.chartData, dataA[0])
    const defaultState = {
        drawData: globalApplicationState.data[loadedData.length - 1],
        tableData: globalApplicationState.data[loadedData.length - 1],
        currentGrouping: "offense",
        seasonalData: loadedData,
        selectedStat: '',
        selectedTeams: new Set(),
    }


    // set default team data across all 9 seasons
    globalApplicationState.tableState = defaultState;
    globalApplicationState.correlationState = defaultState;
    globalApplicationState.histogramState = defaultState;
    globalApplicationState.scatterState = defaultState;

    // set table state initialize table
    globalApplicationState.table = new Table(globalApplicationState)

    // initialize correlation
    globalApplicationState.years = [new Date('2013'), new Date('2014'), new Date('2015'), new Date('2016'), new Date('2017'), new Date('2018'), new Date('2019'), new Date('2020')]
    globalApplicationState.correlation = new Correlation(globalApplicationState)

    // initialize histogram
    globalApplicationState.histogram = new Histogram(globalApplicationState)

    // initialize scatter plot
    globalApplicationState.scatter = new Scatter(globalApplicationState)

    // add dropdown to select season
    let seasons = ["13", "14", "15", "16", "17", "18", "19", "20"]
    let tablediv = d3.select("#table-div")
    tablediv.insert("label", "table").attr("for", "season").text("Choose Season:")
    tablediv.insert("select", "table").attr('name', "season").attr("id", "season").selectAll("option").data(seasons)
        .join("option").attr("value", d => d).attr("selected", d => d === "20" ? "selected" : "").text(d => "20" + d);

    let histResOptions = [10, 9, 8, 7, 6, 5]
    let histDiv = d3.select("#hist-div")
    histDiv.insert("label", "svg").attr("for", "resolution").text("Resolution: ")
    histDiv.insert("select", "svg").attr("name", "resolution").attr("id", "res-button").selectAll("option").data(histResOptions)
        .join("option").attr("value", d => d).attr("selected", d => d === 5 ? "selected" : "").text(d => String(d))

    // add dropdown to select column grouping
    tablediv.insert("label", "table").attr("for", "grouping").text("Choose Grouping:")
    tablediv.insert("select", "table").attr('name', "grouping").attr("id", "grouping").selectAll("option").data(["offense", "defense"])
        .join("option").attr("value", d => d).text(d => d);
    tablediv.selectAll("label").style('margin', '10px')

    // attach handler to select
    d3.select("#season").on("change", changeSeasonHandler)
    d3.select("#grouping").on("change", changeGroupingHandler)
    d3.select("#res-button").on("change", changeHistResHandler)

    // sort handler
    d3.select("#columnHeaders").selectAll("td")
        .attr("class", "sortable")
    //     .on("click",
    //     sortHandler)

});

function sortHandler(d) {
    let header = this
    globalApplicationState.table.sortTable(this.__data__)
}

function changeHistResHandler(d) {
    globalApplicationState.histogram.setResolution(parseInt(this.value))
}

function changeGroupingHandler(d) {
    globalApplicationState.table.changeGrouping(this.value)
}

function changeSeasonHandler(d) {

    globalApplicationState.table.changeSeason(this.value)
}

function groupByTeam(array) {


    const teamMap = new Map();

    for (let i = 0; i < array.length; i++) {
        let yearData = array[i]
        let teamGrouping = d3.group(yearData, d => d.Team);

        // In this format, key is the value we want and value is the key
        teamGrouping.forEach(function (value, key) {
            // check if map has key then append teamdata to map
            if (teamMap.has(key)) {
                let teamdata = teamMap.get(key)
                teamdata.push(value)
                teamMap.set(key, teamdata)
            } else {
                teamMap.set(key, [value])
            }
        });
    }

    return teamMap
}

function cleanDataFrame(data) {

    const regex = /\s\((.*?)\)/
    data.forEach(function (d) {

        // get the team conference and append it to the object
        let conference = d.Team.match(regex) // returns arr
        // debugger;

        // remove conf string from team column
        d.Team = d.Team.replace(conference[0], "") // replace not inplace


    })

}

function formatYearColumn(data) {
    // iterate through the teamMap and check each team to see if it has all  9 seasons
    let missing = []
    data.forEach((value, key) => {
        if (value.length < 8) {
            //if not remove from the teamMap
            missing.push(key)
            globalApplicationState.teamMap.delete(`${key}`)
        }
    });
    return missing
}

function parseStats(data) {
    // iterate through the teamMap and check each team to see if it has all  9 seasons
    const teamStats = {}
    data.forEach(function (team) {
        teamStats[team[0][0].Team] = {}
        const Win = []
        const Loss = []
        const games = []
        const off_rank = []
        const off_plays = []
        const off_yards = []
        const off_yards_play = []
        const off_yards_per_game = []
        const off_tds = []
        const def_rank = []
        const yards_allowed = []
        const def_plays = []
        const yards_play_allowed = []
        const yards_per_game_allowed = []
        const def_TD_allowed_Total = []
        const first_dwn_rank = []
        const def_first_dwn_rank = []
        const pass_off_rank = []
        const pass_attempts = []
        const pass_complete = []
        const pass_yards = []
        const interceptions = []
        const pass_tds = []
        const pass_def_rank = []
        const opp_pass_tds_allowed = []
        const redzone_off_rank = []
        const redzone_points = []
        const redzone_def_rank = []
        const redzone_scores_allowed = []
        const rush_off_rank = []
        const rush_tds = []
        const rush_yards = []
        const rush_yards_play = []
        const rush_yards_game = []
        const rush_def_rank = []
        const rush_yards_allowed = []
        const yds_rush_allowed = []
        const rush_yards_allowed_per_game = []
        const opp_rush_touchdowns_allowed = []
        const sack_rank = []
        const sack_total = []
        const off_tds_allowed = []
        const pass_yards_attempt = []
        const yards_attempt_allowed = []
        const pass_yards_per_game = []
        const opp_pass_yds_allowed = []
        const total_tds_allowed = []
        const opp_completions_allowed = []
        const yards_completion_allowed = []
        const pass_yards_per_game_allowed = []
        const avg_points_per_game_allowed = []
        const points_allowed = []
        const rush_yards_per_game_allowed = []
        const touchdowns_allowed = []


        team.forEach(function (year) {
            Win.push(parseInt(year[0].Win))
            Loss.push(parseInt(year[0].Loss))
            games.push(parseInt(year[0].Games))
            off_rank.push(parseInt(year[0]['Off.Rank']))
            off_plays.push(parseInt(year[0]['Off.Plays']))
            off_yards.push(parseInt(year[0]['Off.Yards']))
            off_yards_play.push(parseInt(year[0]["Off.Yards.Play"]))
            off_yards_per_game.push(parseInt(year[0]["Off.Yards.per.Game"]))
            off_tds.push(parseInt(year[0]['Off.TDs']))
            def_rank.push(parseInt(year[0]['Def.Rank']))
            yards_per_game_allowed.push(parseInt(year[0]["Yards.Per.Game.Allowed"]))
            yards_play_allowed.push(parseInt(year[0]["Yards.Play.Allowed"]))
            yards_allowed.push(parseInt(year[0]["Yards.Allowed"]))
            def_plays.push(parseInt(year[0]["Def.Plays"]))
            def_TD_allowed_Total.push(parseInt(year[0]["Total.TDs.Allowed"]))
            first_dwn_rank.push(parseInt(year[0]['First.Down.Rank']))
            def_first_dwn_rank.push(parseInt(year[0]['First.Down.Def.Rank']))
            pass_off_rank.push(parseInt(year[0]['Passing.Off.Rank']))
            pass_attempts.push(parseInt(year[0]['Pass.Attempts']))
            pass_complete.push(parseInt(year[0]['Pass.Completions']))
            interceptions.push(parseInt(year[0]['Interceptions.Thrown.x']))
            pass_tds.push(parseInt(year[0]['Pass.Touchdowns']))
            pass_def_rank.push(parseInt(year[0]['Pass.Def.Rank']))
            opp_completions_allowed.push(parseInt(year[0]['Opp.Completions.Allowed']))
            redzone_off_rank.push(parseInt(year[0]['Redzone.Off.Rank']))
            redzone_points.push(parseInt(year[0]['Redzone.Scores']))
            redzone_def_rank.push(parseInt(year[0]['Redzone.Def.Rank']))
            redzone_scores_allowed.push(parseInt(year[0]['Opp.Redzone.Scores']))
            rush_off_rank.push(parseInt(year[0]['Rushing.Off.Rank']))
            rush_tds.push(parseInt(year[0]['Rushing.TD']))
            rush_yards.push(parseInt(year[0]['Rush.Yds']))
            rush_yards_play.push(parseInt(year[0]['Yards.Rush']))
            rush_yards_game.push(parseInt(year[0]['Rushing.Yards.per.Game']))
            yds_rush_allowed.push(parseInt(year[0]['Yds.Rush.Allowed']))
            rush_yards_allowed_per_game.push(parseInt(year[0]['Rush.Yards.Per.Game.Allowed']))
            rush_def_rank.push(parseInt(year[0]['Rushing.Def.Rank']))
            opp_rush_touchdowns_allowed.push(parseInt(year[0]['Opp.Rush.Touchdowns.Allowed']))
            rush_yards_allowed.push(parseInt(year[0]['Opp.Rush.Yards.Alloweed']))
            off_tds_allowed.push(parseInt(year[0]['Off.TDs.Allowed']))
            sack_total.push(parseInt(year[0]['Sacks']))
            sack_rank.push(parseInt(year[0]['Sack.Rank']))
            opp_pass_tds_allowed.push(parseInt(year[0]['Opp.Pass.TDs.Allowed']))
            pass_yards.push(parseInt(year[0]['Pass.Yards']))
            pass_yards_attempt.push(parseInt(year[0]['Pass.Yards.Attempt']))
            pass_yards_per_game.push(parseInt(year[0]['Pass.Yards.Per.Game']))
            opp_pass_yds_allowed.push(parseInt(year[0]['Opp.Pass.Yds.Allowed']))
            total_tds_allowed.push(parseInt(year[0]['Total.TDs.Allowed']))
            yards_attempt_allowed.push(parseInt(year[0]['Yards.Attempt.Allowed']))
            yards_completion_allowed.push(parseInt(year[0]['Yards.Completion.Allowed']))
            pass_yards_per_game_allowed.push(parseInt(year[0]['Pass.Yards.Per.Game.Allowed']))
            avg_points_per_game_allowed.push(parseInt(year[0]['Avg.Points.per.Game.Allowed']))
            points_allowed.push(parseInt(year[0]['Points.Allowed']))
            rush_yards_per_game_allowed.push(parseInt(year[0]['Rush.Yards.Per.Game.Allowed']))
            touchdowns_allowed.push(parseInt(year[0]['Touchdowns.Allowed']))


        })
        teamStats[team[0][0].Team].win = Win
        teamStats[team[0][0].Team].loss = Loss
        teamStats[team[0][0].Team].games = games
        teamStats[team[0][0].Team].off_rank = off_rank
        teamStats[team[0][0].Team].off_plays = off_plays
        teamStats[team[0][0].Team].off_yards = off_yards
        teamStats[team[0][0].Team].off_yards_play = off_yards_play
        teamStats[team[0][0].Team].off_yards_per_game = off_yards_per_game
        teamStats[team[0][0].Team].off_tds = off_tds
        teamStats[team[0][0].Team].def_rank = def_rank
        teamStats[team[0][0].Team].yards_allowed = yards_allowed
        teamStats[team[0][0].Team].yards_play_allowed = yards_play_allowed
        teamStats[team[0][0].Team].yards_per_game_allowed = yards_per_game_allowed
        teamStats[team[0][0].Team].def_TD_allowed_Total = def_TD_allowed_Total
        teamStats[team[0][0].Team].first_dwn_rank = first_dwn_rank
        teamStats[team[0][0].Team].pass_off_rank = pass_off_rank
        teamStats[team[0][0].Team].pass_def_rank = pass_def_rank
        teamStats[team[0][0].Team].pass_attempts = pass_attempts
        teamStats[team[0][0].Team].pass_complete = pass_complete
        teamStats[team[0][0].Team].interceptions = interceptions
        teamStats[team[0][0].Team].pass_tds = pass_tds
        teamStats[team[0][0].Team].opp_pass_yds_allowed = opp_pass_yds_allowed
        teamStats[team[0][0].Team].opp_completions_allowed = opp_completions_allowed
        teamStats[team[0][0].Team].redzone_off_rank = redzone_off_rank
        teamStats[team[0][0].Team].redzone_points = redzone_points
        teamStats[team[0][0].Team].redzone_def_rank = redzone_def_rank
        teamStats[team[0][0].Team].redzone_scores_allowed = redzone_scores_allowed
        teamStats[team[0][0].Team].rush_tds = rush_tds
        teamStats[team[0][0].Team].rush_yards = rush_yards
        teamStats[team[0][0].Team].rush_yards_allowed = rush_yards_allowed
        teamStats[team[0][0].Team].rush_off_rank = rush_off_rank
        teamStats[team[0][0].Team].rush_yards_play = rush_yards_play
        teamStats[team[0][0].Team].rush_yards_game = rush_yards_game
        teamStats[team[0][0].Team].yds_rush_allowed = yds_rush_allowed
        teamStats[team[0][0].Team].rush_yards_allowed_per_game = rush_yards_allowed_per_game
        teamStats[team[0][0].Team].rush_def_rank = rush_def_rank
        teamStats[team[0][0].Team].opp_rush_touchdowns_allowed = opp_rush_touchdowns_allowed
        teamStats[team[0][0].Team].sack_rank = sack_rank
        teamStats[team[0][0].Team].sack_total = sack_total
        teamStats[team[0][0].Team].opp_pass_tds_allowed = opp_pass_tds_allowed
        teamStats[team[0][0].Team].off_tds_allowed = off_tds_allowed
        teamStats[team[0][0].Team].pass_yards = pass_yards
        teamStats[team[0][0].Team].pass_yards_attempt = pass_yards_attempt
        teamStats[team[0][0].Team].pass_yards_per_game = pass_yards_per_game
        teamStats[team[0][0].Team].def_plays = def_plays
        teamStats[team[0][0].Team].total_tds_allowed = total_tds_allowed
        teamStats[team[0][0].Team].yards_attempt_allowed = yards_attempt_allowed
        teamStats[team[0][0].Team].yards_completion_allowed = yards_completion_allowed
        teamStats[team[0][0].Team].pass_yards_per_game_allowed = pass_yards_per_game_allowed
        teamStats[team[0][0].Team].avg_points_per_game_allowed = avg_points_per_game_allowed
        teamStats[team[0][0].Team].points_allowed = points_allowed
        teamStats[team[0][0].Team].rush_yards_per_game_allowed = rush_yards_per_game_allowed
        teamStats[team[0][0].Team].touchdowns_allowed = touchdowns_allowed

    })
    return teamStats
}

function logoDataStructure(teamName, dataA) {
    let team = {}
    let nm = Object.keys(teamName)
    dataA.forEach(function (d) {
        let v = d.school
        v = v.replace("State", "St.")
        v = v.replaceAll("Army", "Army West Point")
        v = v.replaceAll("Central Michigan", "Central Mich.")
        v = v.replaceAll("Florida International", "FIU")
        v = v.replaceAll("Florida Atlantic", "Fla. Atlantic")
        v = v.replaceAll("UMass", "Massachusetts")
        v = v.replaceAll("Middle Tennessee", "Middle Tenn.")
        v = v.replaceAll("North Carolina St.", "NC St.")
        v = v.replaceAll("Northern Illinois", "Northern Ill.")
        v = v.replaceAll("South Florida", "South Fla.")
        v = v.replaceAll("USC", "Southern California")
        v = v.replaceAll("Southern Mississippi", "Southern Miss.")
        v = v.replaceAll("Western Kentucky", "Western Ky.")
        v = v.replaceAll("Eastern Michigan", "Eastern Mich.")
        v = v.replaceAll("Western Michigan", "Western Mich.")
        if (v.includes("Miami")) {
            if (v.length === 5) {
                v = v.replaceAll("Miami", "Miami (ACC)")
            } else {
                v = v.replaceAll("Miami (OH)", "Miami (MAC)")
            }
        }
        if (v.includes("NC St.")) {
            v = v.replaceAll("NC St.", "NC State")
        }
        if (nm.includes(v)) {
            team[`${v}`] = d.logo
        }
    })
    return team
}

