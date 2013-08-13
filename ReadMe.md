# Ecosur-Directory
================

The Directory project is a Node.js Express application that connects to an ElasticSearch server that has been
populated with data from our internal databases. Search is paged, and results are grouped by _score and ordered 
by the last name of individuals in the database.

## Getting-Started 
 
Please install the bower dependencies by means of grunt:

    $grunt install || grunt bower

Create a distribution by running the default task:

    $grunt 

Clean the build (remove the distribution directory and accompanying zip) with clean:

    $grunt clean

This module also depends upon [elasticsearch](http://elasticsearch.org) running and accessible on localhost. Of course, the elasticsearch index (and more specifically, jdbc_river) must be populated with relevant data for our templates to be fulfilled. If you are using this as an example project, please be aware of the specificity of these templates and our search callbacks.





