import {env} from 'cloudflare:workers';
import {handleHarborApi} from '../../../../lib/harbor-api.mjs';
export const dynamic='force-dynamic';
export async function GET(request:Request){return handleHarborApi(request,{DB:env.DB});}
export const POST=GET;
export const PUT=GET;
export const DELETE=GET;
