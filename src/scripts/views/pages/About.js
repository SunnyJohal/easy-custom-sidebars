/**
 * External dependancies
 */
import { Link, Redirect } from 'react-router-dom';

/**
 * WordPress dependancies
 */
import { __, _x } from '@wordpress/i18n';
import { TabPanel } from '@wordpress/components';

/**
 * Internal dependancies
 */
import { AboutContent, CreditsContent, SupportContent, WhatsNewContent } from '../components/about';

const AboutTabPanel = () => {
  const tabs = [
    {
      name: 'whats-new',
      title: __(`What's New`, 'easy-custom-sidebars'),
      className: 'ecs-tab',
      content: <WhatsNewContent />
    },
    {
      name: 'about',
      title: 'About',
      className: 'ecs-tab',
      content: <AboutContent />
    },
    {
      name: 'credits',
      title: __('Credits', 'easy-custom-sidebars'),
      className: 'ecs-tab',
      content: <CreditsContent />
    },
    {
      name: 'support',
      title: __('Support', 'easy-custom-sidebars'),
      className: 'ecs-tab',
      content: <SupportContent />
    },
    {
      name: 'get-started',
      title: __('Get Started', 'easy-custom-sidebars'),
      className: 'ecs-tab',
      content: <Redirect to="/themes.php?page=easy-custom-sidebars" />
    }
  ];

  return (
    <TabPanel className="ecs-about__header-tab-panel" activeClass="ecs-tab-active" tabs={tabs}>
      {tab => {
        return <div className="ecs-about__header-tab-panel-content">{tab.content}</div>;
      }}
    </TabPanel>
  );
};

const About = () => {
  return (
    <div className="ecs-about__container">
      {/* Header */}
      <div className="ecs-about__header">
        {/* Plugin Name */}
        <div className="ecs-about__header-title">
          <p>
            {__('Easy Custom', 'easy-custom-sidebars')} <span>{__('Sidebars', 'easy-custom-sidebars')}</span>
          </p>
        </div>

        {/* Plugin Description */}
        <div className="ecs-about__header-text">
          <p>
            {__('A sidebar replacement plugin built by ', 'easy-custom-sidebars')}
            <a href="https://titaniumthemes.com" target="_blank">
              {_x('Titanium Themes', 'Plugin author', 'easy-custom-sidebars')}
            </a>
            {` | ${_x('v2.0.0', 'Plugin version', 'easy-custom-sidebars')}`}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <AboutTabPanel />
      <hr />

      {/* Get Started */}
      <div className="return-to-dashboard">
        <Link to="/themes.php?page=easy-custom-sidebars">
          {__(`Go to Appearance → Theme Sidebars`, 'easy-custom-sidebars')}
        </Link>
      </div>
    </div>
  );
};

export default About;
