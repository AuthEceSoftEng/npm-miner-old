import React from 'react';

const NpmsioInfo = ({ npmsIoPackage }) => {
  return (
<div className="card">
    <header className="card-header">
        <p className="card-header-title">
        npms.io
        </p>
    </header>
    <div className="card-content">
        <div className="is-size-7">
            <ul>
                <li>
                <span>Final score:</span>
                <span className='is-pulled-right'>{npmsIoPackage.score.final.toFixed(2)}</span>
                </li>
                <li>
                <span>Quality:</span>
                <span className='is-pulled-right'>{npmsIoPackage.score.detail.quality.toFixed(2)}</span>
                </li>
                <li>
                <span>Popularity:</span>
                <span className='is-pulled-right'>{npmsIoPackage.score.detail.popularity.toFixed(2)}</span>
                </li>
                <li>
                <span>Maintenance:</span>
                <span className='is-pulled-right'>{npmsIoPackage.score.detail.maintenance.toFixed(2)}</span>
                </li>
            </ul>
        </div>
    </div>
</div>

        
  );
};
export default NpmsioInfo;
