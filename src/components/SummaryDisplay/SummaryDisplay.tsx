import styles from "./SummaryDisplay.module.scss";
import { useLocation } from "react-router-dom";

const SummaryDisplay: React.FC = () => {
  const location = useLocation();
  console.log(location.state);
  const text = location.state.text;

  if (text) {
    return <div className={styles.summary}>{text}</div>;
  }

  return (
    <div className={styles.summary}>
      "See discussions, stats, and author profiles for this publication at: https://www.researchgate.net/publication/362324779 Implementation of RESTful API Web Services Architecture in Takeaway Application Development Article · July 2022 CITATIONS 2 READS 798
      8 authors , including: Imam Ahmad Teknokrat Indonesia University 32 PUBLICATIONS 0 CITATIONS SEE PROFILE Yessi Jusman Universitas Muhammadiyah Yogyakarta 113 PUBLICATIONS 0 CITATIONS SEE PROFILE Rohmat Indra Universitas Teknokrat Indonesia 50
      PUBLICATIONS 0 CITATIONS SEE PROFILE Asmawati Asmawati Universitas Abulyatama 16 PUBLICATIONS 0 CITATIONS SEE PROFILE All content following this page was uploaded by Asmawati Asmawati on 29 July 2022. The user has requested enhancement of the downloaded
      file. Implementation of RESTful API Web Services Architecture in Takeaway Application Development Imam Ahmad Faculty of Engineering and Computer Science Universitas Teknokrat Indonesia Bandarlampung, Indonesia imamahmad @teknokrat.ac.id Asmawati
      Department of Development Economics Universitas Abulyatama Aceh Besar , Indonesia asmawati@abulyatama.ac.id Emi Suwarni Faculty of Economics and Business Univers itas Teknokrat Indonesia Bandarlampung, Indonesia emisuwarni@teknokrat.ac.id Farli Rossi
      Faculty of Engineering and Computer Science Universitas Teknokrat Indonesia Bandarlampung, Indonesia farli@teknokrat.ac.id Rohmat Indra Borman Faculty of Engineering and Computer Science Universitas Teknokrat Indonesia Bandarlampung, Indonesia
      rohmat_indra@teknokrat.ac.id Yessi Jusman Department of Electrical Engineering, Faculty of Engineering Universitas Muhammadiyah Yogyakarta , Yogyakarta, Indonesia yjusman@umy.ac.id Abstract — The Covid - 19 that hit the world had an impact on the
      economy, especially in the trade sector, one of which was experienced by Small and Medium Enterprises (SMEs). Hanura Takeaway ( Haway) is an SME engaged in the delivery of goods and food. To facilitate transactions for goods and food delivery services,
      it is necessary to develop applications that simplify the transaction process. In developing web services, it is necessary to excha nge data that is accessed via standard internet protocols. Therefore, we need a web service in developing this
      application. Implementing a RESTful API web service will certainly facilitate the development of software applications outside the system or with different programming languages or platforms. This research will develop web service architecture using
      RESTful API in Takeaway application. To optimize the URI, several parameters are used, including filtering, sorting, selection and pagination. The Ta keaway application consists of a website as a backend and an Android - based as a frontend. From the
      test results based on the function method using the Postman application, it shows that the REST API Sever built on the server has been running well. In testi ng the response time using the Apache JMeter application, the application shows a good response
      time. Meanwhile, the comparison of responses and requests to SOAP and REST architectures shows that REST takes faster time. Keywords — application development, RE STful API, web services I. I NTRODUCTION Currently , Indonesia and even the world are being
      shocked by an infectious virus originating from the province of Wuhan, China. This virus is considered very dangerous because the transmission is so fast. Then, WHO dete rmined and named the virus as Coronavirus Disease of 2019 or abbreviated as Covid -
      19 [1] . The Covid - 19 virus has caused millions of deaths worldwide. So that it becomes a frightening specter for ev ery human being to interact at close range. Indonesia has taken steps to deal with the Covid - 19 pandemic, one of which is by issuing
      health protocols, including: wash hands, wear masks, keep distance, stay away from crowds and reduce mobility . The Covid - 1 9 pandemic that has occurred has had an unfavourable impact on the economy, especially in the trade sector [2] . One of the
      trade sectors affected by the Covid - 19 pandemic is Small and Medium Enterprises (SMEs). The Covid - 19 pandemic affects the income of SMEs, this is due to the difficulty of running a business, especially in marketing and selling products that are
      carried out with an offline system [3] . The decline in sales during this pandemic period was felt by SMEs in Hanura Village in Teluk Pandan District, Pesawaran Regency, Lampung Province. For businesses in the culinary field, it is advisable to provide
      delivery or take away services in order to r educe crowds. This opens up opportunities for delivery or delivery services. However, in Hanura Village there are no online motorcycle taxis or start - up sector delivery of goods that reach the area. This is
      due to the distance between Hanura Village and th e city centre. The development of technology today is balanced with the emergence of applications that help in human work. The use of applications in helping human work is considered to be able to
      increase the speed and efficiency of energy, time and cost s without reducing the quality of the work done [4] [5] . The delivery system has been implemented by several start - ups including Gojek, Grab, Maxim, Shopee and others. The delivery application
      is an application that can help custome rs to order products and have them delivered to their destination without having to go to the location and meet the seller [6] . The use of online delivery applications is considered effective in helping buyers and
      sellers because it facilitates transactions and can be done by buyers wherever and whenever [7] . Businesses run using applications can increase marketing reach to get new customers [8] . Web applications are currently widely used in building information
      systems. Website development th at is used for backend or web view on other platforms, for example Android, has faced many obstacles, including interoperability and integrating different systems. So it takes the implementation of a web architecture that
      can overcome this. Currently, many web services have been developed using the REST (Representational State Transfer) architecture. Where the architecture uses the existing functionality of the application layer protocol Hypertext Transfer Protocol (HTTP)
      [9] . The existence of RE ST has resulted in an increase in the use of websites that use this architecture when compared to the use of traditional web services with Simple Object Access Protocol (SOAP). Large companies, including Twitter, Amazon, etc.,
      have used REST - like interface s for their services with Application Programming Interfaces (API) documentation. REST implementation facilitates the development of software applications outside the system, because it offers the use of different
      programming languages or platforms [10] . 978-1-6654-0546-1/21/$31.00 ©2021 IEEE 2021 1st International Conference on Electronic and Electrical Engineering and Intelligent System (ICE3IS) 132 2021 1st International Conference on Electronic and Electrical
      Engineering and Intelligent System (ICE3IS) | 978-1-6654-0546-1/21/$31.00 ©2021 IEEE | DOI: 10.1109/ICE3IS54102.2021.9649679 Authorized licensed use limited to: UNIVERSITAS GADJAH MADA. Downloaded on December 28,2021 at 15:42:23 UTC from IEEE Xplore.
      Restrictions apply. REST which is an architecture for the application of web services in applying the concept of switching between states [11] . The st ate here can be described as a browser requesting a web page, on the server side it will send the
      current state of the web page to the browser. The REST API allows various systems to communicate and send/receive data in a very simple way [12] . Inside the RESTful API there is a REST client that can access data/resources on the REST server where each
      resource will be distinguished by a global ID o r URIs (Universal Resource Identifiers). This makes the RESTful API very suitable to be applied to startup websites that are integrated with smartphones, one of wh ich is the Takeaway application . Despite
      this trend, there are still no standards regarding R ESTful web service development, especially on URI resource optimization URIs. This research will develop web services architecture using RESTful API in Takeaway application. The Takeaway application
      consists of a website as a backend and an Android - based a s a frontend. The RESTful API implementation is used to provide convenience in combining functions to develop application programs without relying on the same operating system, programming
      language, or database because this web service communicates using u niversal standard data formats, namely XML and JSON. For development standards in optimizing URI resources, this paper will use parameters including filtering, sorting, selection and
      pagination. II. R ELATED W ORK Currently, the development of web services using REST services has been widely used, and even provides available web Application Programming Interfaces (API) [10] . Several studies show that developers have switched from
      Simple Object Access Protocol (SOAP) to Representational State Transfer (REST) web services, as a means of websit e or application services [10] [13] . REST is considered to provid e e asy access to data resources [11] . The REST architecture was
      introduced in 2000, by Thomas Fieldin g, and is based on the principles that underpin the World Wide Web [14] . Sever al studies have used the RESTfu l API in the web service architecture on the developed web [15] [16] [17] [18] . In research [19] , RE…"
    </div>
  );
};

export default SummaryDisplay;
