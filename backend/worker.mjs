import {handleHarborApi} from '../lib/harbor-api.mjs';
export default {fetch(request,env){return handleHarborApi(request,env);}};
