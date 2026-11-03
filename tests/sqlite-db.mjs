import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
export class SqliteD1{
 constructor(file=':memory:'){this.sqlite=new DatabaseSync(file);this.sqlite.exec('PRAGMA foreign_keys=ON; PRAGMA journal_mode=WAL;');if(!this.sqlite.prepare("SELECT name FROM sqlite_master WHERE name='accounts'").get())this.sqlite.exec(readFileSync(new URL('./schema.sql',import.meta.url),'utf8'));}
 prepare(sql){const self=this;return {sql,values:[],bind(...values){return {...this,values};},async first(){return self.sqlite.prepare(sql).get(...this.values)||null;},async all(){return {results:self.sqlite.prepare(sql).all(...this.values),success:true};},async run(){const result=self.sqlite.prepare(sql).run(...this.values);return {success:true,meta:{changes:Number(result.changes)}};}};}
 async batch(statements){this.sqlite.exec('BEGIN');try{const result=[];for(const s of statements)result.push(await s.run());this.sqlite.exec('COMMIT');return result;}catch(error){this.sqlite.exec('ROLLBACK');throw error;}}
 close(){this.sqlite.close();}
}
