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
1. Run ```npm run test``` in the top level directory
2. To find code coverage, run ```npm run coverage``` in the same directory
3. To generate nice-looking HTML code coverage report, run
   ```npm run report```