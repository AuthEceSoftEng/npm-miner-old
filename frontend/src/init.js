import GoogleAnalytics from 'react-ga';

export default function initGA() {
    if (process.env.NODE_ENV === 'production') {
        GoogleAnalytics.initialize('UA-17339437-5')
    }
}