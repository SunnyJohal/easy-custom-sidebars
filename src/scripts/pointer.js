/**
 * External Dependancies
 */
import $ from 'jquery';

/**
 * WordPress Dependancies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

$(function () {
  const content = `
    <h3>${__('Sidebar Replacements', 'easy-custom-sidebars')}</h3>
    <p>${__('Create and manage your sidebar replacements in the Appearance menu.', 'easy-custom-sidebars')}</p>
  `;

  $('#menu-appearance')
    .pointer({
      content,
      close: () => {
        apiFetch({
          path: '/easy-custom-sidebars/v1/hide-pointer',
          method: 'POST'
        });
      }
    })
    .pointer('open');
});
