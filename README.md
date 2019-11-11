# FlickList
This repository contains all source code for the FlickList application.
Source code contributed by Colby Saxton, John Shi, Zane Varner, George Vo.

# To run
1. Make sure node.js is installed in your system
2. Install all dependencies by running the command ```npm install``` in the
top level directory (same level as README.md)
    - Also run ```npm install -g browser-sync``` (for browser viewing)
3. Run the command ```node server.js``` in the same top level directory
4. To view the output, go into ```public/``` and run the command
    ```
    browser-sync start --server --directory --files “**/*”
    ```

# To run unit tests
1. Install Jasmine with the command ```npm install -g jasmine```
2. Run ```jasmine [spec_filename]``` in the top level directory
    - To run specific specs, specify their filename(s)
    - To run all tests, don't specify any filenames