# iLMS Captcha Breaker

A single JavaScript that can solve the iLMS captcha. This is our final project of NTHU DSP Lab.

## Demo

The answer of captcha will fill in automatically. The calculation should be done as soon as the captcha image is loaded.

![demo_frame41](./demo_frame41.png)

![demo_frame42](./demo_frame42.png)


## Installation

### Safari

1.  Install an open source [Userscripts Editor](https://github.com/quoid/userscripts) via [Mac App Store](https://itunes.apple.com/us/app/userscripts/id1463298887).
2.  Create a new JavaScript.
3.  Copy and paste the latest script from `src` directory.
4.  Hit the "save" buttom.
5.  Open an [iLMS login page](https://lms.nthu.edu.tw/login_page.php) to check result.

### Chrome

1.  Install an open source [Code Injector](https://github.com/urmilparikh/Code-Injector) via [Web Store](https://chrome.google.com/webstore/detail/code-injector/jgcallaoodbhagkaoobenaabockcejmc).
2.  Add rule.
3.  Fill in the URL pattern with somthing like `*://lms.*.edu.tw/login_page.php*` or `*://ilms.*.edu.tw/login_page.php*`.
4.  Copy and paste the latest script from `src` directory.
5.  Hit the "save" button.
6.  Open an [iLMS login page](https://lms.nthu.edu.tw/login_page.php) to check result.



## Update Info

-   v3 at 2021/01/20: Remove the dependence upon OpenCV to reduce the delay by a lot.

    