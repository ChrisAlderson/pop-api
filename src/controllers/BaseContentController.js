// Import the necessary modules.
// @flow
import type {
  $Application,
  $Response,
  $Request
} from 'express'

import IContentController from './IContentController'
import type ContentService from './ContentService'

/**
 * Base class for getting content from endpoints.
 * @implements {IContentController}
 * @type {BaseContentController}
 */
export default class BaseContentController extends IContentController {

  /**
   * The service of the content controller.
   * @type {ContentService}
   */
  _service: ContentService

  /**
   * Create a new base content controller.
   * @param {!Object} options - The options for the base content controller.
   * @param {!ContentService} options.service - The service for the content
   * controller.
   */
  constructor({service}: Object): void {
    super()

    /**
     * The service of the content controller.
     * @type {ContentService}
     */
    this._service = service
  }

  /**
   * Register the default methods to the default routes.
   * @param {!Express} app - The express instance to register the routes to.
   * @param {?PopApi} [PopApi] - The PopApi instance.
   * @throws {Error} - Using default method: 'registerRoutes'
   * @returns {undefined}
   */
  registerRoutes(app: $Application, PopApi?: any): void {
    const t = this._service.itemType

    app.get(`/${t}s`, this.getContents.bind(this))
    app.get(`/${t}s/:page`, this.getPage.bind(this))
    app.get(`/${t}/:id`, this.getContent.bind(this))
    app.post(`/${t}s`, this.createContent.bind(this))
    app.put(`/${t}/:id`, this.updateContent.bind(this))
    app.delete(`/${t}/:id`, this.deleteContent.bind(this))
    app.get(`/random/${t}`, this.getRandomContent.bind(this))
  }

  /**
   * Get all the available pages.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Array<string>, Object>} - A list of pages which are
   * available.
   */
  getContents(req: $Request, res: $Response): Promise<Array<string> | Object> {
    return this._service.getContents().then(content => {
      if (content.length === 0) {
        return res.status(204).json()
      }

      return res.json(content)
    }).catch(err => res.status(500).json(err))
  }

  /**
   * Default method to sort the items.
   * @param {!string} sort - The property to sort on.
   * @param {!number} order - The way to sort the property.
   * @returns {Object} - The sort object.
   */
  sortContent(sort: string, order: number): Object {
    return {
      [sort]: order
    }
  }

  /**
   * Get content from one page.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Array<Object>, Object>} - The content of one page.
   */
  getPage(req: $Request, res: $Response): Promise<Array<any> | Object> {
    const { page } = req.params
    const { sort, order } = req.query

    const o = parseInt(order, 10) ? parseInt(order, 10) : -1
    const s = typeof sort === 'string' ? this.sortContent(sort, o) : null

    return this._service.getPage(s, Number(page)).then(content => {
      if (content.length === 0) {
        return res.status(204).json()
      }

      return res.json(content)
    }).catch(err => res.status(500).json(err))
  }

  /**
   * Get a content item based on the id.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Object, Object>} - The details of a single content item.
   */
  getContent(req: $Request, res: $Response): Promise<any> {
    return this._service.getContent(req.params.id).then(content => {
      if (!content) {
        return res.status(204).json()
      }

      return res.json(content)
    }).catch(err => res.status(500).json(err))
  }

  /**
   * Create a new content item.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Object, Object>} - The created content item.
   */
  createContent(req: $Request, res: $Response): Promise<any> {
    return this._service.createContent(req.body)
      .then(content => res.json(content))
      .catch(err => res.status(500).json(err))
  }

  /**
   * Update the info of one content item.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Object, Object>} - The updated content item.
   */
  updateContent(req: $Request, res: $Response): Promise<any> {
    return this._service.updateContent(req.params.id, req.body)
      .then(content => res.json(content))
      .catch(err => res.status(500).json(err))
  }

  /**
   * Delete a content item.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Object, Object>} - The deleted content item
   */
  deleteContent(req: $Request, res: $Response): Promise<any> {
    return this._service.deleteContent(req.params.id)
      .then(content => res.json(content))
      .catch(err => res.status(500).json(err))
  }

  /**
   * Get a random item.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Object, Object>} - A random item.
   */
  getRandomContent(req: $Request, res: $Response): Promise<any> {
    return this._service.getRandomContent().then(content => {
      if (!content) {
        return res.status(204).json()
      }

      return res.json(content)
    }).catch(err => res.status(500).json(err))
  }

}
