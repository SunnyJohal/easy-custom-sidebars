/**
 * WordPress dependancies
 */
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';

const WhatsNewContent = () => {
  return (
    <>
      {/* Banner */}
      <div className="ecs-about__section is-feature has-accent-background-color">
        <h1>{__('Replace any sidebar in your theme.', 'easy-custom-sidebars')}</h1>

        <p>
          {__(
            `A simple and easy way to replace any widget area in your theme. You can even replace multiple different sidebars/widget areas on the same page.`,
            'easy-custom-sidebars'
          )}
        </p>
      </div>

      <hr />

      {/* Theme Notice */}
      <div
        className="ecs-about__section is-feature"
        style={{
          backgroundImage: 'url(https://miro.medium.com/max/1400/1*q5Go60AJCvjJan7Yl9i3yw.png)',
          backgroundSize: 'cover'
        }}
      >
        <div className="column" style={{ backgroundColor: 'rgba(255,255,255,0.8)' }}>
          <h2>{__('Our new WordPress theme is almost ready!', 'easy-custom-sidebars')}</h2>
          <p>
            {__('Want to know when we launch? Awesome! ', 'easy-custom-sidebars')}
            <a href="https://titaniumthemes.com">{__('Visit our website', 'easy-custom-sidebars')}</a>
            {__(' and enter your details and we will e-mail you as soon as we are ready.', 'easy-custom-sidebars')}
          </p>
          <Button href="https://titaniumthemes.com" target="_blank" isPrimary style={{ marginTop: 32 }}>
            {__('Find out more', 'easy-custom-sidebars')}
          </Button>
        </div>
      </div>
    </>
  );
};

export default WhatsNewContent;
