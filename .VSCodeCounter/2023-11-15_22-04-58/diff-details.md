# Diff Details

Date : 2023-11-15 22:04:58

Directory c:\\Users\\rohit\\OneDrive\\Documents\\web project\\chat-app\\chat-app\\server

Total : 49 files,  -242 codes, 45 comments, -67 blanks, all -264 lines

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [client/.eslintrc.cjs](/client/.eslintrc.cjs) | JavaScript | -20 | 0 | -1 | -21 |
| [client/README.md](/client/README.md) | Markdown | -5 | 0 | -4 | -9 |
| [client/index.html](/client/index.html) | HTML | -13 | 0 | -1 | -14 |
| [client/package-lock.json](/client/package-lock.json) | JSON | -4,057 | 0 | -1 | -4,058 |
| [client/package.json](/client/package.json) | JSON | -30 | 0 | -1 | -31 |
| [client/src/App.css](/client/src/App.css) | CSS | 0 | 0 | -1 | -1 |
| [client/src/App.jsx](/client/src/App.jsx) | JavaScript JSX | -16 | 0 | -4 | -20 |
| [client/src/components/Auth/animations.jsx](/client/src/components/Auth/animations.jsx) | JavaScript JSX | -63 | 0 | -8 | -71 |
| [client/src/components/Auth/cstomstyles.jsx](/client/src/components/Auth/cstomstyles.jsx) | JavaScript JSX | -165 | 0 | -11 | -176 |
| [client/src/components/Chatpage/Chat.jsx](/client/src/components/Chatpage/Chat.jsx) | JavaScript JSX | -62 | 0 | -9 | -71 |
| [client/src/components/Chatpage/RequestBox.jsx](/client/src/components/Chatpage/RequestBox.jsx) | JavaScript JSX | -46 | 0 | -10 | -56 |
| [client/src/components/Chatpage/customstyles.jsx](/client/src/components/Chatpage/customstyles.jsx) | JavaScript JSX | -138 | 0 | -14 | -152 |
| [client/src/components/landingpage/Nav.jsx](/client/src/components/landingpage/Nav.jsx) | JavaScript JSX | -41 | 0 | -5 | -46 |
| [client/src/components/landingpage/animations.jsx](/client/src/components/landingpage/animations.jsx) | JavaScript JSX | -13 | 0 | -1 | -14 |
| [client/src/components/landingpage/customstyles.jsx](/client/src/components/landingpage/customstyles.jsx) | JavaScript JSX | -116 | 0 | -10 | -126 |
| [client/src/context/SocketProvider.jsx](/client/src/context/SocketProvider.jsx) | JavaScript JSX | -56 | 0 | -17 | -73 |
| [client/src/index.css](/client/src/index.css) | CSS | -59 | 0 | -8 | -67 |
| [client/src/main.jsx](/client/src/main.jsx) | JavaScript JSX | -13 | 0 | -2 | -15 |
| [client/src/pages/Authbox.jsx](/client/src/pages/Authbox.jsx) | JavaScript JSX | -82 | 0 | -39 | -121 |
| [client/src/pages/Chatpage.jsx](/client/src/pages/Chatpage.jsx) | JavaScript JSX | -115 | -1 | -33 | -149 |
| [client/src/pages/LandingPage.jsx](/client/src/pages/LandingPage.jsx) | JavaScript JSX | -146 | -2 | -34 | -182 |
| [client/src/utils/Reconnection.jsx](/client/src/utils/Reconnection.jsx) | JavaScript JSX | -7 | 0 | 0 | -7 |
| [client/vite.config.js](/client/vite.config.js) | JavaScript | -5 | -1 | -2 | -8 |
| [server/Controller/TokenController.js](/server/Controller/TokenController.js) | JavaScript | 13 | 0 | 4 | 17 |
| [server/Controller/roomController.js](/server/Controller/roomController.js) | JavaScript | 77 | 0 | 18 | 95 |
| [server/Errors/customerr.js](/server/Errors/customerr.js) | JavaScript | 7 | 0 | 0 | 7 |
| [server/Errors/index.js](/server/Errors/index.js) | JavaScript | 4 | 0 | 1 | 5 |
| [server/index.js](/server/index.js) | JavaScript | 114 | 23 | 41 | 178 |
| [server/middleware/bodyParser.js](/server/middleware/bodyParser.js) | JavaScript | 25 | 0 | 4 | 29 |
| [server/middleware/defaultpage.js](/server/middleware/defaultpage.js) | JavaScript | 5 | 0 | 0 | 5 |
| [server/middleware/errorhandleerror.js](/server/middleware/errorhandleerror.js) | JavaScript | 5 | 0 | 0 | 5 |
| [server/middleware/headerhandler.js](/server/middleware/headerhandler.js) | JavaScript | 12 | 0 | 3 | 15 |
| [server/middleware/index.js](/server/middleware/index.js) | JavaScript | 12 | 0 | 2 | 14 |
| [server/middleware/tokengenerator.js](/server/middleware/tokengenerator.js) | JavaScript | 18 | 0 | 7 | 25 |
| [server/package-lock.json](/server/package-lock.json) | JSON | 4,327 | 0 | 1 | 4,328 |
| [server/package.json](/server/package.json) | JSON | 21 | 0 | 1 | 22 |
| [server/socket.js](/server/socket.js) | JavaScript | 21 | 1 | 5 | 27 |
| [server/wsmethods/cancelrequest.js](/server/wsmethods/cancelrequest.js) | JavaScript | 2 | 0 | 1 | 3 |
| [server/wsmethods/createroom.js](/server/wsmethods/createroom.js) | JavaScript | 26 | 7 | 3 | 36 |
| [server/wsmethods/index.js](/server/wsmethods/index.js) | JavaScript | 12 | 0 | 1 | 13 |
| [server/wsmethods/joinroom.js](/server/wsmethods/joinroom.js) | JavaScript | 29 | 10 | 9 | 48 |
| [server/wsmethods/leaveroom.js](/server/wsmethods/leaveroom.js) | JavaScript | 34 | 0 | 16 | 50 |
| [server/wsmethods/permission.js](/server/wsmethods/permission.js) | JavaScript | 33 | 8 | 7 | 48 |
| [server/wsmethods/senttoall.js](/server/wsmethods/senttoall.js) | JavaScript | 5 | 0 | 0 | 5 |
| [server/wstestmethods/createroom.test.js](/server/wstestmethods/createroom.test.js) | JavaScript | 58 | 0 | 6 | 64 |
| [server/wstestmethods/joinroom.test.js](/server/wstestmethods/joinroom.test.js) | JavaScript | 88 | 0 | 5 | 93 |
| [server/wstestmethods/leaveroom.test.js](/server/wstestmethods/leaveroom.test.js) | JavaScript | 14 | 0 | 6 | 20 |
| [server/wstestmethods/permission.test.js](/server/wstestmethods/permission.test.js) | JavaScript | 47 | 0 | 6 | 53 |
| [server/wstestmethods/testmaps.js](/server/wstestmethods/testmaps.js) | JavaScript | 17 | 0 | 2 | 19 |

[Summary](results.md) / [Details](details.md) / [Diff Summary](diff.md) / Diff Details