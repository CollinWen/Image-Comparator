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
@db = CouchRest.database!("http://admin:password@172.16.42.15:5984/#{dbname}")

#CouchRest.put("http://localhost:5984/testdb/doc", 'name' => 'test', 'date' => Date.current)

ims.each_with_index do |fileName, idx|
  uuid = SecureRandom.uuid

  obj = { :origin => "#{fileName}",
    :id => uuid,
    :type => "OCTImages",
    :timeAdded => Time.now()
  }

  numImages = 0
  Dir.glob(fileName+"/*").each_with_index do |im, idx|
    numImages = idx
  end

  obj['numImages'] = (numImages+1)

  folderID = "OCT" + (idx+1).to_s
  puts folderID
  obj['_id'] = folderID

  #puts obj
  response = @db.save_doc(obj)

  Dir.glob(fileName+"/*").each_with_index do |im, idx|
    puts im
    puts idx
    thisIm=im.split('/').last
    imClass=thisIm.split('.').last
    puts thisIm
    puts imClass

    obj = @db.get(response['id'])
    @db.put_attachment(obj, "image"+idx.to_s, File.open(im), :content_type => "image/#{imClass}")
  end
end
