
import { Plugin, PluginEvent, PluginMeta} from "@posthog/plugin-scaffold"

export type UrlRegexPlugin = Plugin<{
    config: {
        regexPattern: string
        replacement: string | "@@@@@"
        regexFlag: string
    }
}>

function regexUrl(url: string, regexPattern: string, replacement: string | "@@@@@", regexFlag: string): string {
    try {
        const rExp : RegExp = new RegExp(regexPattern, regexFlag);
        replacement = replacement ? replacement : "@@@@@"
        const regexedUrl = new URL(url).href.replace(rExp, replacement);
        return regexedUrl.toString();
    } catch (e) {
        return url;
    }
}

export function processEvent(event: PluginEvent, meta: PluginMeta<UrlRegexPlugin>)
{
    const {config} = meta
    const current_url = event?.properties?.$current_url;
    if (event?.properties && current_url && config.regexPattern)
    {
        const regexed_url = regexUrl(current_url, config.regexPattern, config.replacement, config.regexFlag);
        event.properties.$regexed_url = regexed_url;
    }
    return event;
}

