
import { Plugin, PluginEvent, PluginInput, PluginMeta} from "@posthog/plugin-scaffold"

export type UrlRegexPlugin = Plugin<{
    config: {
        regexPattern: string
        replacement: string | null
        regexFlag: string
        mergeFlag: boolean 
    }
}>

function regexUrl(url: string, regexPattern: string, replacement: string | null, regexFlag: string): string {
    try {
        const rExp : RegExp = new RegExp(regexPattern, regexFlag);
        replacement = replacement ? replacement : "@@@@@"
        const regexedUrl = new URL(url).href.replace(rExp, replacement);
        return regexedUrl.toString();

    } catch (e) {
        throw `Invalid URL!`;
    }
}

export function processEvent(event: PluginEvent, meta: PluginMeta<UrlRegexPlugin>)
{   
    const {config} = meta
    const current_url = event?.properties?.$current_url;
    if (event?.properties && current_url && config.regexPattern)
    {
        const regexed_url = regexUrl(current_url, config.regexPattern, config.replacement, config.regexFlag);
        if (config.mergeFlag == true){
            event.properties.$regexed_url = regexed_url;
            event.properties.$current_url = regexed_url;
        } else {
            event.properties.$regexed_url = regexed_url;
        }
        console.debug(
            `event.$current_url: "${current_url}" regexed to "${regexed_url}"`
        );
    }
    return event;
}

