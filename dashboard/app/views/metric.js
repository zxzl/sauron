import { View } from 'backbone'
import MetricModel from '../models/metric'
import Chart from 'chart.js'
import app from '../app'

export default View.extend({
  tagName: 'li',

  initialize: function (options) {
    this.metricName = options.metricName
    this.instanceType = options.instanceType
    this.model = new MetricModel({ metricName: this.metricName, instanceType: this.instanceType })
    this.model.fetch()
    this.listenTo(this.model, 'loaded', this.drawChart)
    this.listenTo(app.globalEvents, 'updateDuration', this.updateChart)
    this.listenTo(app.globalEvents, this.instanceType + ':showResource', this.showResource)
  },

  template: require('../templates/metric_view.hbs'),

  render: function () {
    this.$el.empty()
    this.$el.html(this.template({
      metricName: this.metricName,
      instanceType: this.instanceType
    }))
    return this
  },

  drawChart: function() {
    var ctx = this.newCtx()
    var data = this.model.get('data')
    var myLineChart = new Chart(ctx).Line(data, { animation: false })
  },

  newCtx: function () {
    this.$('.chart-container').remove()
    this.render()
    return this.$('.chart-container').get(0).getContext('2d')
  },

  updateChart: function(duration) {
    this.model.set({ duration: duration })
  },

  showResource: function(resource) {
    this.model.set({ instanceId: resource.id })
  }
})
