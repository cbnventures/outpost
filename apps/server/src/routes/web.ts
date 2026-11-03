import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import express from 'express';

import { sendError } from '../lib/http.js';

import type {
  Routes_Web_Runner_AllowCaching_Next,
  Routes_Web_Runner_AllowCaching_Request,
  Routes_Web_Runner_AllowCaching_Response,
  Routes_Web_Runner_AllowCaching_Returns,
  Routes_Web_Runner_Constructor_Root,
  Routes_Web_Runner_DashboardHeaders_Next,
  Routes_Web_Runner_DashboardHeaders_Request,
  Routes_Web_Runner_DashboardHeaders_Response,
  Routes_Web_Runner_DashboardHeaders_Returns,
  Routes_Web_Runner_RedirectBrowsers_Next,
  Routes_Web_Runner_RedirectBrowsers_Preferred,
  Routes_Web_Runner_RedirectBrowsers_Request,
  Routes_Web_Runner_RedirectBrowsers_Response,
  Routes_Web_Runner_RedirectBrowsers_Returns,
  Routes_Web_Runner_Register_App,
  Routes_Web_Runner_Register_Returns,
  Routes_Web_Runner_Root,
  Routes_Web_Runner_SendApplication_Request,
  Routes_Web_Runner_SendApplication_Response,
  Routes_Web_Runner_SendApplication_Returns,
} from '../types/routes/web.d.ts';

/**
 * Routes - Web.
 *
 * Serves the built dashboard at /admin and sends browsers that open the root there.
 * Every dashboard path returns the same page, and the dashboard picks the screen.
 *
 * @since 1.0.0
 */
export class Runner {
  /**
   * Routes - Web - Root.
   *
   * Points to the folder the Vite build writes the dashboard into.
   * Hashed asset names let those files be cached for a year.
   *
   * @private
   *
   * @since 1.0.0
   */
  readonly #root: Routes_Web_Runner_Root;

  /**
   * Routes - Web - Constructor.
   *
   * Uses the built dashboard beside the compiled server unless a folder is given.
   * Tests pass their own folder.
   *
   * @param {Routes_Web_Runner_Constructor_Root} [root] - Root.
   *
   * @since 1.0.0
   */
  public constructor(root?: Routes_Web_Runner_Constructor_Root) {
    this.#root = root ?? fileURLToPath(new URL('../../build/admin', import.meta.url));

    return;
  }

  /**
   * Routes - Web - Register.
   *
   * Installs the root redirect, the strict browser policy, the files, and the page.
   * Asset files are cached for a year, and every other dashboard path gets the page.
   *
   * @param {Routes_Web_Runner_Register_App} app - App.
   *
   * @returns {Routes_Web_Runner_Register_Returns}
   *
   * @since 1.0.0
   */
  public register(app: Routes_Web_Runner_Register_App): Routes_Web_Runner_Register_Returns {
    app.get('/', this['redirectBrowsers'].bind(this));

    app.use('/admin', this['dashboardHeaders'].bind(this));

    app.use('/admin/assets', this['allowCaching'].bind(this), express.static(join(this.#root, 'assets'), {
      fallthrough: false,
      immutable: true,
      index: false,
      maxAge: '1y',
    }));

    app.use('/admin', this['allowCaching'].bind(this), express.static(this.#root, {
      index: false,
      maxAge: '1h',
    }));

    app.get([
      '/admin',
      '/admin/*splat',
    ], this['sendApplication'].bind(this));

    return;
  }

  /**
   * Routes - Web - Allow Caching.
   *
   * Removes the default no-store header so static files can set their own lifetime.
   * The page itself is sent later with no-store again.
   *
   * @param {Routes_Web_Runner_AllowCaching_Request}  _request - Request.
   * @param {Routes_Web_Runner_AllowCaching_Response} response - Response.
   * @param {Routes_Web_Runner_AllowCaching_Next}     next     - Next.
   *
   * @private
   *
   * @returns {Routes_Web_Runner_AllowCaching_Returns}
   *
   * @since 1.0.0
   */
  private allowCaching(_request: Routes_Web_Runner_AllowCaching_Request, response: Routes_Web_Runner_AllowCaching_Response, next: Routes_Web_Runner_AllowCaching_Next): Routes_Web_Runner_AllowCaching_Returns {
    response.removeHeader('Cache-Control');

    next();

    return;
  }

  /**
   * Routes - Web - Dashboard Headers.
   *
   * Applies a restrictive browser policy to every dashboard response.
   * The page loads scripts, styles, and data only from this same address.
   *
   * @param {Routes_Web_Runner_DashboardHeaders_Request}  _request - Request.
   * @param {Routes_Web_Runner_DashboardHeaders_Response} response - Response.
   * @param {Routes_Web_Runner_DashboardHeaders_Next}     next     - Next.
   *
   * @private
   *
   * @returns {Routes_Web_Runner_DashboardHeaders_Returns}
   *
   * @since 1.0.0
   */
  private dashboardHeaders(_request: Routes_Web_Runner_DashboardHeaders_Request, response: Routes_Web_Runner_DashboardHeaders_Response, next: Routes_Web_Runner_DashboardHeaders_Next): Routes_Web_Runner_DashboardHeaders_Returns {
    response.set({
      'Content-Security-Policy': 'default-src \'self\'; base-uri \'none\'; connect-src \'self\'; font-src \'self\'; form-action \'self\'; frame-ancestors \'none\'; img-src \'self\' data:; object-src \'none\'; script-src \'self\'; style-src \'self\'',
      'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
      'X-Frame-Options': 'DENY',
    });

    next();

    return;
  }

  /**
   * Routes - Web - Redirect Browsers.
   *
   * Sends a browser that opens the root address to the dashboard.
   * Requests with a token, or that prefer JSON, get the usual not-found answer.
   *
   * @param {Routes_Web_Runner_RedirectBrowsers_Request}  request  - Request.
   * @param {Routes_Web_Runner_RedirectBrowsers_Response} response - Response.
   * @param {Routes_Web_Runner_RedirectBrowsers_Next}     next     - Next.
   *
   * @private
   *
   * @returns {Routes_Web_Runner_RedirectBrowsers_Returns}
   *
   * @since 1.0.0
   */
  private redirectBrowsers(request: Routes_Web_Runner_RedirectBrowsers_Request, response: Routes_Web_Runner_RedirectBrowsers_Response, next: Routes_Web_Runner_RedirectBrowsers_Next): Routes_Web_Runner_RedirectBrowsers_Returns {
    const preferred: Routes_Web_Runner_RedirectBrowsers_Preferred = request.accepts([
      'json',
      'html',
    ]);

    if (request.get('Authorization') === undefined && preferred === 'html') {
      response.redirect(302, '/admin/');

      return;
    }

    next();

    return;
  }

  /**
   * Routes - Web - Send Application.
   *
   * Returns the dashboard page for any dashboard path so links and reloads work.
   * A missing build answers with a clear error instead of an empty page.
   *
   * @param {Routes_Web_Runner_SendApplication_Request}  _request - Request.
   * @param {Routes_Web_Runner_SendApplication_Response} response - Response.
   *
   * @private
   *
   * @returns {Routes_Web_Runner_SendApplication_Returns}
   *
   * @since 1.0.0
   */
  private sendApplication(_request: Routes_Web_Runner_SendApplication_Request, response: Routes_Web_Runner_SendApplication_Response): Routes_Web_Runner_SendApplication_Returns {
    response.set('Cache-Control', 'no-store');

    // Resolve relative to the folder; absolute paths under dot-folders (like ~/.code) are refused.
    response.sendFile('index.html', { root: this.#root }, (error) => {
      if (error !== undefined && response.headersSent === false) {
        sendError(response, 404, 'console_not_built', 'The dashboard isn\'t built. Run npm run build:web in apps/server.');
      }

      return;
    });

    return;
  }
}
