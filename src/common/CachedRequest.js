import moment from "moment";

class CachedRequest {
    requests = {};

    query(key, fn, cacheTime, unitOfTime) {
        if (!this.requests[key]) {
            this.requests[key] = {
                working: false,
                loaded: false,
                promise: null,
            };
        }
        let request = this.requests[key];
        if (request.working || (request.loaded && moment().subtract(cacheTime, unitOfTime).isBefore(request.loaded))) {
            return request.promise;
        }
        request.working = true;
        request.promise = fn();
        request.promise.then(() => {
            request.loaded = moment();
            request.working = false;
        }).catch(() => {
            request.working = false;
        });
        return request.promise;
    }
}

const cachedRequest = new CachedRequest();

export default cachedRequest;
