import "./About.css";
import saltImg from "../images/Lanka-Salt.jpg";

function About() {
  return (
    <section className="story">
      <div className="story-left">
      <h2>OUR STORY</h2>
        <p>
          National Salt Ltd. has a long history in salt production in Sri Lanka.
          It manufactures common salt, iodine mixed salt, crush salt, and 
          Industrial salt. The major production areas are located in Mannar and
          Elephantpass (Kilinochchi) District, and its administrative office located 
          in Colombo. The salt department was started in 1938 and went through 
          different administrative control and finally it was named as National
          Salt Ltd from 2001and in June 2021 it is renamed as National Salt Limited and
          now functioning under the purview of Ministry of Industry and Entrepreneurship 
          Development. The salt is being recognized as best in quality (96% is Nacl) in
          compare to the harvested salt in other part of the country. Currently Mannar 
          Saltern produce 6,000MT of raw salt and the Elephnatpass Saltern produce
          17,000MT per annum. It has been decided to develop Elephantpass Saltern to 
          produce 20,000 MT/Annum in 2025. The National Salt not only functions as a 
          natural resource extracting center also giving focus on employment opportunities
          to the vulnerable people in the Mannar and Kilinochchi districts. As at today
          there are 64 permanent staff and roughly 250 seasonal staff are employed by the
          institution.National Salt Ltd is governing by the board which comprised by the
          members represent from Treasury and other government /private institutions and it 
          comes under the purview of Ministry of Finance. The Enterprise Division of the 
          Ministry is monitoring and facilitating the development, legal and accountable
          matters of the company. As it is a government enterprise it is registered under 
          the company Act. No. 7 of 2007 as a Limited Company to abide for the company rules.
          Meanwhile the institution is certified by the Sri Lanka Standard Institution to ensure
          the quality of the product. And also, the company is being audited by the Auditor
          General Department. Sri Lanka is almost reaching self-sufficient in the salt production. 
          Only close to 3-4% of the PVD salt is being now imported by the food & pharmaceutical industries.
          National Salt Limited is trying to ensure that Sri Lanka is self-sufficient in the salt 
          production in year 2026.
        </p>
      </div>

      <img src={saltImg} className="story-img"  alt="Salt"/>
    </section>
  );
}

export default About;
