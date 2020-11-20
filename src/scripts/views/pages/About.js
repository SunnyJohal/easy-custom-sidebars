/**
 * External dependancies
 */
import { NavLink, Redirect, Route } from 'react-router-dom';

/**
 * WordPress dependancies
 */
import { __, _x } from '@wordpress/i18n';
import { Button, TabPanel } from '@wordpress/components';

/**
 * Internal dependancies
 */
import { CreditsContent, WhatsNewContent } from '../components/about';

const AboutTabPanel = () => {
  const tabs = [
    {
      name: 'whats-new',
      title: __(`What's New`, 'easy-custom-sidebars'),
      className: 'ecs-tab',
      content: <WhatsNewContent />
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
      content: (
        <Route
          path="/"
          render={() => {
            window.location = 'https://wordpress.org/support/plugin/easy-custom-sidebars/';
            return <h1>{__('Redirecting to plugin support...', 'easy-custom-sidebars')}</h1>;
          }}
        />
      )
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
    <>
      <div className="ecs-about__container container mt-5">
        <div className="ecs-about__header row align-items-center justify-content-center">
          <div className="col-12">
            <div className="ecs-about__header-bg p-5">
              <div className="ecs-about__header-title pt-3">
                <p>{__('Easy Custom Sidebars', 'easy-custom-sidebars')}</p>
              </div>
              <div className="ecs-about__header-text pt-3">
                <p>
                  {__('A sidebar replacement plugin built by ', 'easy-custom-sidebars')}
                  <a href="https://titaniumthemes.com" target="_blank">
                    {_x('Titanium Themes', 'Plugin author', 'easy-custom-sidebars')}
                  </a>
                  <span>{`${_x('v2.0.0', 'Plugin version', 'easy-custom-sidebars')}`}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            {/* Tabs */}
            <AboutTabPanel />
            <hr />
          </div>
        </div>

        {/* Get Started */}
        <div className="return-to-dashboard">
          <NavLink to="/themes.php?page=easy-custom-sidebars">
            <Button isPrimary>{__(`Go to Appearance → Sidebar Replacements`, 'easy-custom-sidebars')}</Button>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default About;
