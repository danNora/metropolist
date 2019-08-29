# City Comparison App

## MVP

* City comparison app that displays side-by-side quality of life data between two “urban areas” returned from Teleport API
* User choose two cities to compare through text input
* Comparison results are dynamically updated

## Todos:

* Add error handling for names that don't return results (i.e. aren't considered urban areas or are mistyped)
* Fix bug where changing 1 input value but keeping the other after an initial query leads to the items appearing out of order
    * Possible solution: clear inputs after every query

## Stretch Goals

* Ability to compare urban areas in an entire country
* Same for continent
* Search autocomplete
* User toggles to personally weight the data
* Definitive answer that city A is better than city B
* Gamify the app
