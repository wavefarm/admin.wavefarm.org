var h = require('hyperscript')
var rels = require('../widget/rels')

module.exports = function (item) {
  return [
    h('input#public', {name: 'public', type: 'checkbox', checked: item.public}),
    h('label.for-check', {htmlFor: 'public'}, 'public'),
    h('label', {'htmlFor': 'title'}, 'title'),
    h('input#title', {name: 'title', type: 'text', value: item.title || ''}),
    h('label', {'htmlFor': 'subtitle'}, 'subtitle'),
    h('input#subtitle', {name: 'subtitle', type: 'text', value: item.subtitle || ''}),
    h('label', {'htmlFor': 'credit'}, 'credit'),
    h('input#credit', {name: 'credit', type: 'text', value: item.credit || ''}),
    h('label', {'htmlFor': 'description'}, 'description'),
    h('textarea#description', {name: 'description', rows: 8}, item.description),
    h('label', {'htmlFor': 'airtime'}, 'airtime'),
    h('input#airtime', {name: 'airtime', type: 'text', value: item.airtime || ''}),
    h('label', {'htmlFor': 'startDate'}, 'startDate'),
    h('input#startDate', {name: 'startDate', type: 'date', value: item.startDate}),
    h('label', {'htmlFor': 'endDate'}, 'endDate'),
    h('input#endDate', {name: 'endDate', type: 'date', value: item.endDate}),
    h('label', {'htmlFor': 'sites'}, 'sites'),
    h('input#sites', {name: 'sites', type: 'text', value: item.sites || ''}),
    h('label', {'htmlFor': 'artists'}, 'artists'),
    rels(item.artists),
    h('label', {'htmlFor': 'collaborators'}, 'collaborators'),
    rels(item.collaborators),
    h('label', {'htmlFor': 'works'}, 'works'),
    rels(item.works),
    h('label', {'htmlFor': 'events'}, 'events'),
    rels(item.events),
    h('label', {'htmlFor': 'shows'}, 'shows'),
    rels(item.shows),
    h('label', {'htmlFor': 'audio'}, 'audio'),
    rels(item.audio),
    h('label', {'htmlFor': 'video'}, 'video'),
    rels(item.video),
    h('label', {'htmlFor': 'image'}, 'image'),
    rels(item.image),
    h('label', {'htmlFor': 'text'}, 'text'),
    rels(item.text),
  ]
}