# What the heck is Android Things??? (it's an Operating System)
> I've been wondering that myself given the landing page for the project doesn't answer that question. After watching a couple Google IO 2017 videos, I think I got it.

Android Things is a version of Android OS but without the User Interface. It runs on small devices like Raspberry Pi 3. In the Android Things SDK you will find Android Libraries for interacting with hardware over interfaces like GPIO. So instead of having to be a Linux administrator to deploy and run your Widget code on something like a Raspberry Pi, you use the Android IDE to write code and deploy to your Raspberry Pi via USB.

Need to manage a fleet of devices and securely update them remotely with "Over the Air" updates? Google Cloud IoT Core, which is currently in closed beta, will soon offer a service to help you with that. Register your devices running Android Things with your Google Cloud IoT Core account and you will be able to push your new code via the UI in the Google Cloud IoT Core.

Here is a collection of links demonstrating developing with Android Things and managing device fleets with Google Cloud IoT Core.

- [Demo of writing code and deploying to hardware in Android Studio](https://youtu.be/v3Dm5aeuQKE?t=219)
- [Documentation on new Android libraries for communicating with things over interfaces like GPIO](https://developer.android.com/things/sdk/pio/gpio.html)
- [Explanation of the architecture of Android Things OS](https://youtu.be/sjpNek_7z-I?t=505)
- [Supported Devices that can run Android Things OS](https://developer.android.com/things/hardware/developer-kits.html)
- [Example of registering a device with Google Cloud IoT using adb CLI and gcloud CLI](https://youtu.be/ETWhOWvqH5E?t=1667)
- [Demo showing registering devices at scale with Google Cloud IoT](https://youtu.be/ETWhOWvqH5E?t=1988)
- [Demo of a custom app that shows device data from Google Clout IoT Core as a dashboard](https://youtu.be/ETWhOWvqH5E?t=2256)
