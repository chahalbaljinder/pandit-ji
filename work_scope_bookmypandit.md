## User Portal

1) Hybrid conversational landing page with AI chat bot  
2) List the Pooja services.  
3) Booking Type:- Normal Booking in Advance , Premium booking (urgent).  
4) Allow to book pooja on urgent basis with special pricing. (on-demand request)  
5) Allow the user to browse through listed pooja services and book the Pooja at user provided schedule (date and Time) and Location (Home/Special temple/Custom Location)  
6) Also allow users to add Pooja Samagri and any other item from “Samagri” Category products to the Pooja booking cart. Only samagri book feature for those who don’t need pandit.  
7) Allow users to Schedule and Book a Special Pooja at Special Temples (from Temples Listings)  
8) capture the unlisted/ unmatched pooja searched by user for future addition.  
9) Allow Users to register and Login..  
10) Live Darshan of Major Temples (https://utsav.gov.in/view-darshan).  
11) Once the user is registered, gather information as below:  
a. Name  
b. Mobile number  
c. Date of Birth (as per Kundali, Optional)  
d. Time of Birth (as per Kundali, optional)  
e. Gender  
f. Marital Status  
g. Anniversary Date  
h. User’s Facebook link (connect to user’s facebook, allows us to post on behalf of user)  
i. Spouse Name (if married, else don’t show this option)  
j. Spouse Mobile Number (Optional)  
k. Spouse Date of Birth (as per Kundali, Optional)  
l. Spouse Time of Birth (as per Kundali, Optional)  
m. Gender (automatically, if primary user is Male, then Spouse gender is female and vice versa).  
n. Spouse Facebook link (connect to user’s facebook)  
o. Children (how many children)  
p. Child-1 Name  
q. Child-1 Mobile number  
r. Child-1 Date of birth (optional)  
s. Child-1 Time of Birth (optional)  
t. Child-1 Gender  
u. Child-1 Facebook link (connect to user’s facebook)  
** Allow user to register using email ID and mobile number and OTP. Also allow user to login without registering by using Facebook login. If user uses Facebook login, create a user with all details fetched from Facebook, also take permission to Post on user’s wall on behalf of the user. Once the user is registered allow users to login via Mobile number and OTP (on WhatsApp). Alternately we can allow user to login using OTP from authenticator mobile App like google authenticator or Microsoft authenticator etc. We can try using our own Authenticator app as well (few codes available on GIT)  
*** If primary user is filling spouse and children details, keep these as virtual users (spouse and children as virtual user). The moment they are connected with Facebook, convert these virtual users to an actual user allowing them also to login using mobile and OTP.  
*** If the user is not filling Optional details.. keep on reminding them from time to time to fill these details so that their experience can be enhanced on the basis of these optional details.  
12) Integrate the Panchang either via “Kerela pro” API or by creating own Panchang software (many codes available on Git).  
13) We will Post on User’s Facebook wall on their special days like Birthdays, Anniversary dates etc.  
14) We will allow user’s to set custom reminder’s for their special Dates/Tithi for Vrats etc.  
15) and we will send reminder’s/custom message (religious intimation on upcoming festivals and pooja) on user’s WhatsApp/mobile App.  
16) Display upcoming festivals/Tithi/Vrat on Home page.  
17) Free/economic payment gateway integration  
18) Courier(samagri) pick (from home) and drop (to customer location) integration.  
19) Real time coordinator assigned.  
20) whatsapp real time/regular updates.  
21) Integration of Logistic website  
22) User rating and review system for pandits and services  
23) Personalized dashboard showing upcoming pooja bookings and past history  
24) Digital prasad delivery option for temple poojas  
25) Multi-language support with at least Hindi and English  
26) Virtual pooja attendance option via video streaming  
27) AI-powered ritual guide explaining procedures during bookings  
28) Astrological insights and recommendations based on user profile data  
29) Notification center for all booking confirmations, updates, and special events  
30) Digital wallet for faster transactions and loyalty points system  

## Pandit Registration Portal

1) Allow pandit to register  
2) Allow Pandit to share Pooja booking link to a yajman directly, allowing user to book pooja with the fixed selected pandit (dedicated Pandit ji booking Link). User will register and is able to book pooja normally in future.  
3) Allow such users to book repeated pooja with same pandit or normally in future.  
4) Pandit profile management with the following features:  
   a. Qualification details and specializations  
   b. Experience and expertise in specific rituals  
   c. Languages spoken  
   d. Availability calendar management  
   e. Service area boundaries  
   f. Pricing configuration for different services  
   g. Gallery for photos and videos of previous ceremonies  
   h. Testimonials section  
5) Pandit mobile app for on-the-go booking management  
6) Real-time notification system for new booking requests  
7) Earnings dashboard and payment history  
8) Dispute resolution system with admin mediation  
9) Knowledge base for rare or complex rituals  
10) Rating and performance metrics visualization  

## Admin Portal

1) Allow admin to Add, modify and delete Pooja services listings, Temple services listings, Pooja samagri listings, E-store listings.  
2) Allow admin to add, modify and delete the Category like Pooja Service, Pooja Samagri, E-store, Merchandise etc.  
3) Allow admin to Tag (add, modify, delete) any service to any category as mentioned above.  
4) Allow admins to create and link Posts pages to the any Item of any category (for eg, allow admin to create an Article post and link it with a Pooja service or pooja samagri).  
5) Allow admin to access and modify any registered users demographic details like Display Name, DOB etc.  
6) The Website should track user’s Facebook/Instagram activity and inference user’s behaviour using AI.  
7) Website should also track user’s behaviour on website like which page user spent most time, what services user spent most of the time, which services user spent least time etc.  
8) Other Analytics for various insights.  
9) Other Admin related features to expand the website’s features in future.  
10) Revenue analytics and financial reporting dashboard  
11) Pandit verification and quality control system  
12) Customer support ticket management system  
13) Content moderation for reviews and user-generated content  
14) Promotional campaign management for special occasions and festivals  
15) Bulk messaging system for updates and announcements  
16) Inventory management system for samagri items  
17) API management for third-party integrations  
18) Data backup and recovery procedures  

## Technical Implementation Considerations

1) Mobile-responsive design with PWA (Progressive Web App) capabilities  
2) Cloud-based infrastructure with auto-scaling for peak festival periods  
3) Microservices architecture for modular development and maintenance  
4) Data security measures including end-to-end encryption for personal information  
5) Real-time database for booking and availability management  
6) CDN implementation for faster content delivery across regions  
7) Multi-factor authentication system for enhanced security  
8) Comprehensive API documentation for third-party developers  
9) Automated testing suite for quality assurance  
10) Analytics implementation using modern data visualization tools  
11) Caching strategies for improved performance  
12) Disaster recovery plan and system redundancy  
13) Compliance with relevant data protection regulations  
14) Continuous integration/continuous deployment pipeline  
15) Performance monitoring and alerting system  
