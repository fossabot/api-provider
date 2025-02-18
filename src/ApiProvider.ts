import {Api, ApiResolver} from "api-core";
import {ApiVersionProvider} from "./ApiVersionProvider";

export class ApiProvider {

    private apis: Api[] = [];
    private resolverFactory: ((api: Api) => ApiResolver)|undefined;
    private providers: ApiVersionProvider[] = [];

    resolver(resolverFactory: (api: Api) => ApiResolver) {
        this.resolverFactory = resolverFactory;
        return this
    }

    version(version: string): ApiVersionProvider {
        const api = new Api(version);
        if(this.resolverFactory) api.resolver = this.resolverFactory(api);

        this.apis.push(api);

        const provider = new ApiVersionProvider(api);
        this.providers.push(provider);

        return provider;
    }

    async provide(provider: any) {
        for(let provider of this.providers) {
            await provider.prepare()
        }

        return new provider(this.apis);
    }

}
