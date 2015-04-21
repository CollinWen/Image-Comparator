require 'couchrest'
require 'securerandom'
uuid = SecureRandom.uuid

baseDir="/Users/jkc/Documents/retinalImaging/website/Image-Comparator/"
imageFolder=ARGV[0]

ims=Dir.glob("#{baseDir}#{imageFolder}/*")

dbname = "rop_images"

#connect to db, create if does not exist
@db = CouchRest.database!("http://127.0.0.1:5984/#{dbname}")
#database = Relaxo.connect("http://localhost:5984/#{dbname}")

ims.each_with_index  do |im, idx|
  puts im
  puts idx
  thisIm=im.split('/').last
  imClass=thisIm.split('.').last
  puts thisIm
  puts imClass
=begin
  obj = { :_id => uuid,
          :origin => "#{thisIm}",
          :id => uuid,
          :timeAdded => Time.now()

          }
=end
  obj = { :origin => "#{thisIm}",
          :id => uuid,
          :timeAdded => Time.now()

        }
  obj['_id']=(idx+1).to_s
  response =@db.save_doc(obj)

  @db.put_attachment(obj, "image", File.open(im), :content_type => "image/#{imClass}")

  #@db.save_doc(obj)

end
