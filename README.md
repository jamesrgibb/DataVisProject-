# DataVisProject


## Overview
All of the code for this project is our own. The only library used was the R JSON library that we used to work with the Logo dataset for our scatterplot tooltip. 

## Project Link
https://jamesrgibb.github.io/DataVisProject-/project.html

## Video Link
https://youtu.be/ojc1iKqe7HY

Our question was whether or not good defense wins championships in college level football. We built a tool for exploring 8 seasons of collegiate football data. Using the table, we can chart the change overtime of each time for each statistic. We can also use the table to update the histogram, which shows where a particular team lies within the distribution of the chosen statistic. We also included a separate scatterplot which can graph any two data features together. This allows a user to examine the correlation of any two stats for all teams. 

### Table

The table is the centerpiece of our project. The table allows us to view all our data, filtering by offensive or defensive statistics and the year of play. We decided to encode the table data using color. The cells are on a diverging scale: a deeper color of red indicates that the selected statistic is farther below the mean of the columns, with green indicating the opposite. We implemented this by storing the entirety of the data in the Table object, then applying our selected filters, storing the result in a seperate object property that is bound to the table data. Furthermore, the table is sortable. The user can click on any column header, continued clicking will alternate between ascending and descending sorting. 

The table also serves as the point of interaction for our histogram and line chart. When a `<td>` is clicked, the histogram changes to measure the data column. The bin containing the selected data is then highlighted. The line chart is also updated, showing a graph of the selectec team's stat over all 8 years of data. If the user clicks on different teams in the same column, they too will be graphed.If the user selects any data that is not in the currently selectec column, the linechart is reset. 

### Line Graph 

The idea of the line graph as mentioned before was to show how the statistics change over time for a certain team. This was a good starting point for the line graph but we decided to implement additional features to promote more interactivity as the TA suggested. We then decided to implement a feature that allows the user to click on a particular cell in the table and the data for that team will populate the line graph. This feature can be seen below. We also decided that just showing one team was not enough perspective for a user. We chose to have the line graph show multiple lines for each team that had been selected. The chart will show the teams that have been selected for a particular statistic. If a new statistic is selected the line chart will show the updated version of the line chart with just the newly selected team. The line chart also dynamically populates the y-axis according to what the user clicks. The range of values in the y-axis change as new values are taken in to always show all the data points in the graph. The graph also updates the y-axis label for the corresponding statistic the user has selected. 

This feature gave the user greater perspective of how much individual team statistics can change year to year. This was a good step in the right direction for helping the user see the different trends over time. We also decided to add a legend with corresponding teams name and the average, we decided to color code the table legend to help the user discern which teams corresponded with which line.

### Histogram

The plan for the histogram was to be able to select a cell and show the distribution of that variable while highlighting the bin that contains the team of the specified cell. Work began by using d3.histogram() to construct the visualization but this caused a number of problems. For reasons we could not decipher, the bins were being constructed and shown with varying widths and placed in nonsensical locations on the x-axis. This led to us scrapping the prebaked implementation and making the whole thing from scratch. This ended up working perfectly with the exception of a bug related to the y-axis. Though the scale was working perfectly, the ticks on the y-axis would just alternate between 0 and the number of bins. We decided to omit the y-axis in the end, as it wasnt ultimately necessary. The final addition to the histogram was the option to change the resolution (number of bins) which allows the user to get a better picture of the distribution should they desire. 

### Scatter Plot

One of our main goals was to show the overall correlation between different statistics and what statistics really affect a teams overall performance. We thought tha
t the implementation of a scatter plot would provide the user with additional insight into what statistics correlated with which statistics. Initially we began we the traditional scatter plot that just showed the Defensive Ranking of  the teams and how that correlated with their wins. This process proved to be more difficult than anticipated for accessing the appropriate values for the scatter plot. We decided to use the same type of data structure that we used for displaying the data. The d3.rollup function proved to be very useful in establishing the corresponding keys with the correct data values. 

The Scatter Plot is configured with two drop down menus that allow the user to decide which data value to put on the x and y axis. Then the user can also choose which year to display. Once these selections have been made the user clicks the “Display Graph” button and the scatter plot will display a different set of data points. 

Although this is insightful for the user to see the correlation without putting names on the data it doesn’t mean as much to someone who is a casual viewer. We then decided to display the school logo corresponding with the dot on the graph. This is displayed when the user is hovers over the dot. This brought up another challenge for us, finding all of the school logos for the dataset. Luckily, we were able to find a dataset that had them. This is the link for the dataset we used. 

https://github.com/Kazink36/cfbplotR/blob/b45dddf61850c20ee724a29a90ddef90de29b794/data/logo_ref.rda 

This proved to be a bit of a challenge to convert this dataset to a json file that we could then parse. We were able to do so first by converting the dataset to json in Rmarkdown because the dataset was written in Rmarkdown.
