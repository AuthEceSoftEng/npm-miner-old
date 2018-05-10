import React from 'react';

const MinedInfo = ({ minedPackageInfo }) => {
  return (
<div className="card">
    <header className="card-header">
        <p className="card-header-title">
        Tools
        </p>
    </header>
    <div className="card-content">
        <div className="is-size-7">
            <ul>
                <li>
                <span>Number of files:</span>
                <span className='is-pulled-right'>{minedPackageInfo.numOfFiles}</span>
                </li>
                <li>
                <span>min directory depth:</span>
                <span className='is-pulled-right'>{minedPackageInfo.minDirDepth}</span>
                </li>
                <li>
                <span>max directory depth:</span>
                <span className='is-pulled-right'>{minedPackageInfo.maxDirDepth}</span>
                </li>
                <li>
                <span>sum directory depth:</span>
                <span className='is-pulled-right'>{minedPackageInfo.sumDirDepth}</span>
                </li>
                <li>
                <span>ES-Lint error count:</span>
                <span className='is-pulled-right'>{minedPackageInfo.eslint.errorCount}</span>
                </li>
                <li>
                <span>ES-Lint warning count:</span>
                <span className='is-pulled-right'>{minedPackageInfo.eslint.warningCount}</span>
                </li>
                <li>
                <span>First order density:</span>
                <span className='is-pulled-right'>{minedPackageInfo.escomplex.firstOrderDensity}</span>
                </li>
                <li>
                <span>Change cost:</span>
                <span className='is-pulled-right'>{minedPackageInfo.escomplex.changeCost.toFixed(2)}</span>
                </li>
                <li>
                <span>Core size:</span>
                <span className='is-pulled-right'>{minedPackageInfo.escomplex.coreSize}</span>
                </li>
                <li>
                <span>Loc:</span>
                <span className='is-pulled-right'>{minedPackageInfo.escomplex.loc.toFixed(2)}</span>
                </li>
                <li>
                <span>Cyclomatic:</span>
                <span className='is-pulled-right'>{minedPackageInfo.escomplex.cyclomatic.toFixed(2)}</span>
                </li>
                <li>
                <span>Effort:</span>
                <span className='is-pulled-right'>{minedPackageInfo.escomplex.effort.toFixed(2)}</span>
                </li>
                <li>
                <span>Params:</span>
                <span className='is-pulled-right'>{minedPackageInfo.escomplex.params.toFixed(2)}</span>
                </li>
                <li>
                <span>Maintainability:</span>
                <span className='is-pulled-right'>{minedPackageInfo.escomplex.maintainability.toFixed(2)}</span>
                </li>
                <li>
                <span>tlocp:</span>
                <span className='is-pulled-right'>{minedPackageInfo.escomplex.tlocp}</span>
                </li>
                <li>
                <span>tlocl:</span>
                <span className='is-pulled-right'>{minedPackageInfo.escomplex.tlocl}</span>
                </li>
                <li>
                <span>nsp:</span>
                <span className='is-pulled-right'>{minedPackageInfo.nsp}</span>
                </li>
            </ul>
        </div>
    </div>
</div>

  );
};
export default MinedInfo;
