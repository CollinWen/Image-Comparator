
##  Image Comparator

User Interface, Algorithms and Database for allowing users to compare two images.

## Organization

1. User Interface - functionally, display the criterion, the images, and get the better match as, e.g., -1, 0, 1
2. Results - Couch DB with Result docs
3. Feeders - Algorithms that access Results to determine the next pair of images for the UI
4. Sorters - Algorithms that access Results to sort the images based on user input
5. Vendor - Third Party dependencies

## Third Party Dependencies

Currently used modules

1. Bootstrap
2. CouchDB

