import logo from "../../assets/svgs/text-logo-mint.svg";
import styles from "../Header/ConferenceHeader.module.css";

const ConferenceHeader = () => {

  return (
    <>
      <div className={styles.ConferenceHeader}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
        </div>  
      </div>
    </>
  );
};

export default ConferenceHeader;