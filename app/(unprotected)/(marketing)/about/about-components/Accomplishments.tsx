import React from "react";
import styles from "../about-styles/Accomplishments.module.css";

export default function Accomplishments() {
  return (
    <section className={styles.accomplishments}>
      <div className={styles.accomplishment}>
        <h3 >100+</h3>
        <p>Donors and volunteer partners in our community.</p>
      </div>
      <div className={styles.accomplishment}>
        <h3>30+</h3>
        <p>
          Non-profit partners who are aligned with our mission and dedicated to
          facilitating change in Africa.
        </p>
      </div>
      <div className={styles.accomplishment}>
        <h3>1</h3>
        <p>App.</p>
      </div>
    </section>
  );
}
