import { PluginEvent, PluginInput, PluginMeta } from "@posthog/plugin-scaffold";
import { processEvent, UrlRegexPlugin } from "./index";

/**
 * Given a url, construct a page view event.
 *
 * @param $current_url The current url of the page view
 * @returns A new PostHog page view event
 */
function buildPageViewEvent($current_url: string): PluginEvent {
  const event: PluginEvent = {
    properties: { $current_url },
    distinct_id: "distinct_id",
    ip: "1.2.3.4",
    site_url: "test.com",
    team_id: 0,
    now: "2022-06-17T20:21:31.778000+00:00",
    event: "$pageview",
    uuid: "01817354-06bb-0000-d31c-2c4eed374100",
  };

  return event;
}

function buildEventWithoutCurrentUrl(): PluginEvent {
  const event: PluginEvent = {
    properties: {},
    distinct_id: "distinct_id",
    ip: "1.2.3.4",
    site_url: "test.com",
    team_id: 0,
    now: "2022-06-17T20:21:31.778000+00:00",
    event: "$identify",
    uuid: "01817354-06bb-0000-d31c-2c4eed374100",
  };

  return event;
}

function getMeta(config: {regexPattern: string, regexFlag: string, replacement: string|null, mergeFlag: boolean}): PluginMeta<UrlRegexPlugin> {
  return {config} as PluginMeta<UrlRegexPlugin>;
}

describe("processEvent", () => {
  it("should not regex a url with an INVALID REGEX expression", () => {
    const sourceEvent = buildPageViewEvent(
        "https://www.bbc.com/news/world-us-canada-62986812"
    );
    const processedEvent = processEvent(sourceEvent, getMeta({regexPattern: "12332143", regexFlag: "g", replacement: "NEWS", mergeFlag: false}));
    expect(processedEvent?.properties?.$regexed_url).toEqual(
      "https://www.bbc.com/news/world-us-canada-62986812"
    );
  });

  it("should regex current_url with the GIVEN replacement string", () => {
    const sourceEvent = buildPageViewEvent(
      "https://www.bbc.com/news/world-us-canada-62986812"
    );
    const processedEvent = processEvent(sourceEvent, getMeta({regexPattern: '\\d+', regexFlag: "g", replacement: "NEWS", mergeFlag: false}));
    expect(processedEvent?.properties?.$regexed_url).toEqual(
      "https://www.bbc.com/news/world-us-canada-NEWS"
    );
  });

  it("should regex current_url with the DEFAULT replacement string", () => {
    const sourceEvent = buildPageViewEvent(
      "https://www.bbc.com/news/world-us-canada-62986812"
    );
    const processedEvent = processEvent(sourceEvent, getMeta({regexPattern: '\\d+', regexFlag: "g", replacement: null,mergeFlag: false}));

    expect(processedEvent?.properties?.$regexed_url).toEqual(
      "https://www.bbc.com/news/world-us-canada-@@@@@"
    );
  });

  it("should merge $regexed_url with $current_url as mergeFlag is set to True", () => {
    const sourceEvent = buildPageViewEvent(
      "https://www.bbc.com/news/world-us-canada-62986812"
    );
    const processedEvent = processEvent(sourceEvent, getMeta({regexPattern: '\\d+', regexFlag: "g", replacement: "NEWS",mergeFlag: true}));

    expect(processedEvent?.properties?.$current_url).toEqual(
      "https://www.bbc.com/news/world-us-canada-NEWS"
    );
  });

  it("shouldn't modify events that DON'T HAVE A $current_url property", () => {
    const sourceEvent = buildEventWithoutCurrentUrl();
    const processedEvent = processEvent(sourceEvent, getMeta({regexPattern: '\\d+', regexFlag: "g", replacement: "NEWS", mergeFlag: false}));

    expect(processedEvent).toEqual(sourceEvent);
    expect(processedEvent?.properties).toEqual(sourceEvent.properties);
    expect(processedEvent?.properties?.$regexed_url).toBeUndefined();
  });

  it("should raise an error if the $current_url is an INVALID URL", () => {
    const sourceEvent = buildPageViewEvent("invalid url");

    expect(() => processEvent(sourceEvent, getMeta({regexPattern: '\\d+', regexFlag: "g", replacement: "NEWS", mergeFlag: false})))
      .toThrowError(`Invalid URL!`);
  });

  it("should LOG THE NORMALIZED URL FOR DEBUGGING", () => {
    const consoleSpy = jest.spyOn(console, "debug");

    const sourceEvent = buildPageViewEvent(
      "https://www.bbc.com/news/world-us-canada-62986812"
    );
    processEvent(sourceEvent, getMeta({regexPattern: '\\d+', regexFlag: "g", replacement: "NEWS", mergeFlag: false}));

    expect(consoleSpy).toHaveBeenCalledWith(
      'event.$current_url: "https://www.bbc.com/news/world-us-canada-62986812" regexed to "https://www.bbc.com/news/world-us-canada-NEWS"'
    );
  });
});
