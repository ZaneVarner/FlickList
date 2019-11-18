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
1. Make sure all dependencies are installed (see step 2 in "To run")
2. More instructions to come (currently in development)