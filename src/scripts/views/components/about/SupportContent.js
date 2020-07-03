/**
 * WordPress dependancies
 */
import { __ } from '@wordpress/i18n';

const SupportContent = () => {
  return (
    <div className="about__section is-feature has-accent-background-color">
      <h1>{__('Support Content.', 'easy-custom-sidebars')}</h1>

      <p>
        {__(
          `More ways to make your pages come alive. With easier ways to get it all done and looking better than ever—and
    boosts in speed you can feel.`,
          'easy-custom-sidebars'
        )}
      </p>
    </div>
  );
};

export default SupportContent;
