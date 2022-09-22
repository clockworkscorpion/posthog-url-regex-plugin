# PostHog URL Regex Plugin

[![npm_package](https://img.shields.io/npm/v/posthog-url-regex-plugin?style=flat-square)](https://www.npmjs.com/package/posthog-url-regex-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg?style=flat-square)](https://opensource.org/licenses/MIT)


A PostHog plugin to apply regex expressions to your urls, which allows you to perform parses easier, etc. This is especially suitable for content management websites/apps which have predefined patterns for url categorization.

Using Regexed URLs will allow you to gain better insights from your url data, specific to your categorization needs. This plugin can be used as a preprocessing step for your data, before you use PostHog Cloud or any external database.

### Example
> - https://www.bbc.com/news/world-us-canada-62986812
> - $regexed_url: https://www.bbc.com/news/world-us-canada-NEWS

[PostHog](https://posthog.com/) is the first open-source analytics platform, especially designed for startups and developers. PostHog allows users to use their tools either on the managed PostHog Cloud, or the self-hosted version. Try it out and show your support!

### [Join the PH Slack community.](https://join.slack.com/t/posthogusers/shared_invite/enQtOTY0MzU5NjAwMDY3LTc2MWQ0OTZlNjhkODk3ZDI3NDVjMDE1YjgxY2I4ZjI4MzJhZmVmNjJkN2NmMGJmMzc2N2U3Yjc3ZjI5NGFlZDQ)

>
> ## Get started
>
> Configure the plugin by entering your parameters for the `regexPattern`, `regexFlag`, `replacement` and `mergeFlag`.
> - `regexPattern` is a self-explanatory required string that has to be passed with your config. Strings not  
> following regex-valid patterns will not show an error - they will pass the same value unchanged.
> - `regexFlag` is a self-explanatory required string that has to be passed with your config. The default flag is
> global (`g`).
> - `replacement` is an optional string that can be passed with your config to substitute values in the regex operation.
> The default value for this is `@@@@@` (no reason in particular)
> - `mergeFlag` is a boolean flag value that has to be passed with your config, and determines whether the regexed
> output changes will be merged into the `properties.$current_url` field, else it creates a new column 
> `properties$regexed_url` field
>
> ## Helpful Tip!
> Always test out your desired regex expressions elsewhere before using this plugin, else you might get some nasty,
> unwanted results!! I had 99 problems before I used Regex to solve them - now I have 100 problems. I personally used 
> [Regexr](https://regexr.com/) and [Regex101](https://regex101.com/)

## Developing Locally

To develop this plugin locally, first clone it and then run specs. Please make sure you've got Node and Yarn (recommended) or npm installed.

> - git clone https://github.com/clockworkscorpion/posthog-url-regex-plugin.git
> - yarn install
> - yarn test --watch

## Installation

You have three options to install this plugin
1. Open PostHog Cloud -> Apps -> Installed Apps -> URL Regex Plugin
2. Install from Github or Gitlab using this repository's URL
3. Install using npm with the url from npmjs.com

## Roadmap

This plugin was created as a starter project, so feel free to contribute, start a discussion or leave an issue if there are features you'd like to see added. For most purposes, it can be considered to be feature complete.

## Contributing

Contributions of code, issues, reviews and documentation are always welcome! This is my first Github-based Open Source contribution, as well as one of my first TypeScript projects. All feedback is welcome!

