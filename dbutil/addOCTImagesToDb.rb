require 'couchrest'
require 'securerandom'


#baseDir="/Users/jkc/Documents/retinalImaging/website/Image-Comparator/"


imageFolder=ARGV[0]

if (ARGV.size != 1) then
  puts "Usage: ruby : #{$PROGRAM_NAME}.rb <imageFolder>";
  puts "where imageFolder is the full path to folder/directory where the images are located."
  exit
end

ims=Dir.glob("#{imageFolder}/*")

dbname = "rop_images"

#connect to db, create if does not exist
@db = CouchRest.database!("http://127.0.0.1:5984/#{dbname}")

#CouchRest.put("http://localhost:5984/testdb/doc", 'name' => 'test', 'date' => Date.current)

Dir.foreach("#{imageFolder}") do |fileName, idx|
  uuid = SecureRandom.uuid

  obj = { :origin => "#{fileName}",
    :id => uuid,
    :type => "OCTImages",
    :timeAdded => Time.now()
  }

  obj['_id']=fileName

  #puts obj
  response =@db.save_doc(obj)

  Dir.foreach("#{imageFolder}/" + fileName) do |im, idx|
    puts im
    puts idx
    thisIm=im.split('/').last
    imClass=thisIm.split('.').last
    puts thisIm
    puts imClass

    @db.put_attachment(obj, "image"+idx.to_s, File.open(im), :content_type => "image/#{imClass}")
  end


end
