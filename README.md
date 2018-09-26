





# Life Cycle

_onLoad_: A function that fires when the application is first booting up. This ends once the mapboxgl map has finished loading.
_onInit_: A function that fires when the mapboxgl map has finished loading.


# Dev Setup

1) Download yarn: 
1) Download parcel:


# How to Build





# Data

## Provided but not Accessible

The data url provided at " https://data.seattle.gov/PublicSafety/Seattle-Police-Department-911-Incident-Response/3k2p-39jp
" was unaccessible even with an account. The page showed the following error.

![readme_images](./readme_images/forbidden_access.png);


## Data that has the Information Needed

**Crime Data**: https://data.seattle.gov/Public-Safety/Crime-Data/4fs7-3vj5?_ga=2.57437162.1742915471.1537729638-1047274212.1537729638


This crime data no longer contains _latitude_ and _longitude_. Instead it contains precincts, sectors, and beats. Here is an example of the data below.

![Crime API Example](./readme_images/crime_api_example.png)

### The Reason Why

![Why Beats, Sectors, and Precincts](./readme_images/beat_level.png)

# Precinct, Sectors, and Beats


Precint and Beat Location Information: https://data.seattle.gov/Public-Safety/Seattle-Police-Department-Beats/nnxn-434b




Converted SPD_Beats.kmz file to .geojson file at:
https://mygeodata.cloud


Found Beats and Precinct info at: http://www.seattle.gov/police/information-and-data/tweets-by-beat


The plan is to use the two maps below to find out which beats are mostly inside of the 1 mile radius, and only include them in the SoQl query.

![Precinct, Sector, and Beats Detailed Image](./readme_images/beats_sectors_precincts.png)


![One Mile Radius](./readme_images/1_mile_radius.png)