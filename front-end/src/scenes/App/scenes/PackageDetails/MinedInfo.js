import React from 'react';
import styles from './package.module.css';

const MinedInfo = ({ minedPackageInfo }) => {
  return (
    <table>
      <tbody>
        <tr className={styles.topTenStars}>
          <td>Number of files:</td>
          <td>{minedPackageInfo.numOfFiles}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>min directory depth:</td>
          <td>{minedPackageInfo.minDirDepth}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>max directory depth:</td>
          <td>{minedPackageInfo.maxDirDepth}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>sum directory depth:</td>
          <td>{minedPackageInfo.sumDirDepth}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>ES-Lint error count:</td>
          <td>{minedPackageInfo.eslint.errorCount}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>ES-Lint warning count:</td>
          <td>{minedPackageInfo.eslint.warningCount}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>First order density:</td>
          <td>{minedPackageInfo.escomplex.firstOrderDensity}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Change cost:</td>
          <td>{minedPackageInfo.escomplex.changeCost.toFixed(2)}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Core size:</td>
          <td>{minedPackageInfo.escomplex.coreSize}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Loc:</td>
          <td>{minedPackageInfo.escomplex.loc.toFixed(2)}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Cyclomatic:</td>
          <td>{minedPackageInfo.escomplex.cyclomatic.toFixed(2)}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Effort:</td>
          <td>{minedPackageInfo.escomplex.effort.toFixed(2)}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Params:</td>
          <td>{minedPackageInfo.escomplex.params.toFixed(2)}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Maintainability:</td>
          <td>{minedPackageInfo.escomplex.maintainability.toFixed(2)}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>tlocp:</td>
          <td>{minedPackageInfo.escomplex.tlocp}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>tlocl:</td>
          <td>{minedPackageInfo.escomplex.tlocl}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>nsp:</td>
          <td>{minedPackageInfo.nsp}</td>
        </tr>
      </tbody>
    </table>
  );
};
export default MinedInfo;
