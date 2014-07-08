
# Thinking about a small Linux computer initiative. Who wants to join?

## Definition of Ground Server, Ground Computing
A Ground Server hosts websites like a Cloud Server hosts websites on the Internet except it's on the ground which means the websites are accessible via your Local Area Network. Ground Servers are usually hosted on little credit card sized computers like the [$35 Raspberry Pi](http://www.raspberrypi.org/) or [$45 BeagleBone Black from Texas Instruments](http://beagleboard.org/Products/BeagleBone+Black). It's Ground Computing, not Cloud Computing. Originally coined by [Jason Huggins](https://twitter.com/hugs/status/1605680019). [More about Ground Computing](https://groundcomputing.hackpad.com/About-Ground-Computing-oHwlcUmeH94)

## Intro
Since the early 2000's I have been a web developer hosting my creations on the Cloud but for the past few years I've found myself hosting web apps in an unusual place, the ground where they are actually used. Servers that host web apps used to cost thousands of dollars but with the arrival of small Linux computers like the Raspberry Pi, you can host your own web apps locally for under $50. But it's not just about hosting web apps, the economics of "small Linux" can be used for environmental monitoring and automation which will have interesting implications for areas such as health, agriculture, environmental justice, and many more. In this post I hope to get you excited about the potential of Ground Computing and explain how we can all benefit from each others work in Ground Computing regardless of the field we are looking to apply this to.

## My journey from the Cloud to the Ground, a summary of recent Ground Computing deployments
Back in 2011 I worked with folks at Cloacina on an online app that publishes historical environmental data about compost piles to surrounding neighbors, the same application today could be hosted on a $35 Raspberry Pi computer and the web app could be broadcasted via local WiFi with the help from the a project I worked on called Apitronic's Hive app. See the summary of that platform on the successfully funded Kickstarter page [here]() and the code is on Github [here](](https://github.com/apitronics/Hive).

![Arduino monitoring a compost pile and sending data through text messages to the Cloud. The same thing could now be built for less without the need for the Cloud server.]()

In Ghana where it is cost prohibitive to have to students online all day to access resources like Khan Academy, Open Learning Exchange Ghana and Open Learning Exchange International had been running a large box server in a small community to provide access to such resources. Last year with funding from USAID's All Children Reading program we were able to deploy to 24 schools where we installed Raspberry Pi computers as the school servers, and with the help of CouchDB, we were able to easily create a sneakernet where we could deliver more content from the Cloud and feedback could sync back up to the Cloud.

![20 Raspberry Pi servers with the BeLL Software deployed in Ghana.]()  

These small Linux computers are good for more than just serving up web apps, they can also do the data collection and even automation needed on the ground.  For example, the Fido project uses a Raspberry Pi with a connected USB temperature sensor to detect when a greenhouse is too hot or too cold, and when outside the bounds set by the Farmer in the local web app, text messages the farmer through the local WiFi connection (text messages can be sent for free via emails by the way). See the demo of a Fido in action at Wild Miller Gardens [here]() and the check out the code on Github over [here](). 

![Within the first few weeks of having installed Fido, farmer Joel of Wild Miller Garden was alerted via text message that it was getting too cold in his Greenhouse at night for the vegetables he was growing.]()


## Thinking about an Open Ground SDK
For the past few years I've been working fairly quietly on the various projects mentioned above and through that work there are components I've found are useful across those projects and useful for many other future projects by people like you! I'm looking to create an Open Ground SDK which will be a collection of code modules commonly needed when developing a Ground Server, many of which can be extracted from work already done. I'm also interested in developing an App server which when running will publish a web page for graphically using many of the modules in Open Ground SDK.  These apps could serve as examples of how to integrate the Open Ground SDK modules into your own project or could be used as is. We also want to publish an example of Open Ground SDK in action for the Raspberry Pi (and possibly also the BeagleBone Black now that they support Debian!). This project could be called GroundHog which will have the App server preinstalled and could be used as a starting point for your Ground Server project. 

## Modules
For now, the following modules are wrapped up in the [Fido](https://github.com/rjsteinert/Fido) project, [Apitronics Hive](https://github.com/apitronics/Hive) project, and [BeLL](http://github.com/open-learning-exchange/) project.

- WiFi Connect - Define what WiFi network the Ground Server should connect to.
- WiFi Access Point Mode - Turn your Ground Computing device into a WiFi access point so you do not need any additional hardware to access the Apps on your Ground Server. 
- Hostname - Define the hostname of the Ground Server so it can easily be reached at a human readable URL on the network. Example: http://myserver.local versus the IP address which is hard to figure out http://192.168.0.101
- Heartbeat - Configure where your Ground Server's heartbeat should call  back to so the server you're pointing to can keep you up to date on the  status of your Ground Server. Great for knowing when your alarms can't alarm you!
- Updater - A framework for publishing updates for Ground Servers and an API to query for available updates and install them.
- Data Hive - View data saved from other devices sent to your Ground Server and manage alerts.
- Sensor Pack - A collection of drivers for commonly used sensors.


## How can you help?

### Join the conversation

### A Ground Computing Initiative in your community

## How can we raise funds to support development of this? Your thought?





