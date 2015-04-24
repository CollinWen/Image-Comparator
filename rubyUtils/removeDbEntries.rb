require 'couchrest'
require  'yaml'
dbName=ARGV[0]


dbname = "image_compare_results"

#connect to db, create if does not exist
db = CouchRest.database!("http://127.0.0.1:5984/#{dbname}")


#docs=CouchRest.get("http://localhost:5984/#{dbname}/_all_docs?include_docs=true")


#docs.each do |d|
#  puts d
#end

## creating a view
=begin
db.save_doc({"_id" => "_design/test",:views => {:test => {:map =>
    "function(doc) {


    emit(doc.winner, doc);

}}})
=end


res= db.view('winner/winner')#.to_yaml
rows= res["rows"]

rows.each do |r|
  thisDocId= r["id"]
  db.get(thisDocId).destroy()
end
