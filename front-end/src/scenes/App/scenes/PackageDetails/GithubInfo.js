import React from 'react';
import styles from './package.module.css';

const GithubInfo = ({ githubInfo }) => {
  return (
    <table>
      <tbody>
        <tr className={styles.topTenStars}>
          <td>Created at:</td>
          <td>{new Date(githubInfo.created_at).toDateString()}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Last update:</td>
          <td>{new Date(githubInfo.updated_at).toDateString()}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Stars count:</td>
          <td>{githubInfo.stargazers_count}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Language:</td>
          <td>{githubInfo.language}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Forks:</td>
          <td>{githubInfo.forks}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Open Issues:</td>
          <td>{githubInfo.open_issues}</td>
        </tr>
        <tr className={styles.topTenStars}>
          <td>Licence:</td>
          <td>{githubInfo.license.name}</td>
        </tr>
      </tbody>
    </table>
  );
};
export default GithubInfo;
