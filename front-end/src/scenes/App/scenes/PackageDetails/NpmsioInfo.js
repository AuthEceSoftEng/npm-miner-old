import React from 'react';
import styles from './package.module.css';

const NpmsioInfo = ({ npmsIoPackage }) => {
  return (
    <table>
      <tbody>
        <tr className={styles.topTenStars}>
          <td>Final score:</td>
          <td>{npmsIoPackage.score.final.toFixed(2)}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Quality:</td>
          <td>{npmsIoPackage.score.detail.quality.toFixed(2)}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Popularity:</td>
          <td>{npmsIoPackage.score.detail.popularity.toFixed(2)}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Maintenance:</td>
          <td>{npmsIoPackage.score.detail.maintenance.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>
  );
};
export default NpmsioInfo;
