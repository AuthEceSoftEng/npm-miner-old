import React from 'react';

const GitHubInfo = ({ githubInfo }) => {
  return (
    <div className="card">
    <header className="card-header">
        <p className="card-header-title">
        GitHub
        </p>
    </header>
    <div className="card-content">
        <div className="is-size-7">
            <ul>
                <li>
                    <span>Created at:</span>
                    <span className='is-pulled-right'>{new Date(githubInfo.created_at).toDateString()}</span>
                </li>
                <li>
                    <span>Last update:</span>
                    <span className='is-pulled-right'>{new Date(githubInfo.updated_at).toDateString()}</span>
                </li>
                <li>
                    <span>Stars count:</span>
                    <span className='is-pulled-right'>{githubInfo.stargazers_count}</span>
                </li>
                <li>
                    <span>Language:</span>
                    <span className='is-pulled-right'>{githubInfo.language}</span>
                </li>
                <li>
                    <span>Forks:</span>
                    <span className='is-pulled-right'>{githubInfo.forks}</span>
                </li>
                <li>
                    <span>Open Issues:</span>
                    <span className='is-pulled-right'>{githubInfo.open_issues}</span>
                </li>
                <li>
                    <span>Licence:</span>
                    <span className='is-pulled-right'>{githubInfo.license.name}</span>
                </li>
            </ul>
        </div>
    </div>
</div>
  );
};
export default GitHubInfo;
