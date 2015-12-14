'use strict';

import { View } from 'backbone'
import app from '../app'
import ServiceModel from '../models/service'
import ServiceCollection from '../models/serviceCollection'
import NewServiceView from './newService'
import _ from 'lodash'

export default View.extend({
  initialize: function (options) {
    var that = this
    app.mainContainer = this.$('#main-container')
    this.services = new ServiceCollection
    this.services.fetch()
    this.$services = this.$('.services')
    this.services.on('sync', function() {
      that.$services.find('.service').remove()
      var template = require('../templates/service_entry.hbs')
      that.services.each(function(service) {
        that.$services.append(template({ service: service.toJSON() }))
      })
    })
  },

  events: {
    'click #open-new-service': 'openNewService'
  },

  openNewService: function () {
    var that = this
    var newServiceView = new NewServiceView().render()
    newServiceView.bind('created', function () {
      setTimeout(function () {
        that.services.fetch()
      }, 500)
    })
    newServiceView.open()
  }
})
