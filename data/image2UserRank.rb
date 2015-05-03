require 'json'
require 'time'
require 'csv'

#file = File.read('rop_images_1100_5_2_2015.json')
file = File.read('rop_images_4_27_2015.json')

contents = JSON.parse(file)

iclDocs = contents['rows'].select{|x| x['doc']['type'] === "image_compare_list"}

# print the icl names
#iclDocs.each{|x| puts x['key']}

# find the tasks
taskRows = contents['rows'].select{|x| x['doc']['type'] === "task"}
tasks = []
taskRows.each{|x| tasks.push(x['doc'])}

# build task to icl map, to look up which icl each result belongs to
task2icl = Hash.new()
tasks.each{|x| task2icl[x['_id']] = x["image_compare_list"]}
#puts task2icl

task2user = Hash.new()
tasks.each{|x| task2user[x['_id']] = x["user"]}
#puts task2user

# now work on the results
icResultRows = contents['rows'].select{|x| x['doc']['type'] === "imageCompareResult"}
icResultRows2 = icResultRows.select{|x| task2icl[x['doc']['task']] === "icl_1_10_rev1"}
#icResultRows2 = icResultRows.select{|x| task2icl[x['doc']['task']] === "ICL_third_set_hundred_r2"}

icResults = []
icResultRows2.each{|x| icResults.push(x['doc'])}
#puts icResultRows2[0]

# sort by task_idx
icResults.sort_by!{|a| [a['user'], a['task_idx'], Time.parse(a['date'])]}

prevUser=''
prevTaskIdx=''
output = []

#remove duplicates
icResultsNoDups=[]
icResults.each do |x|  
    if (x['user'] != prevUser || x['task_idx'] != prevTaskId })
        icResultsNoDups.push(x);
        
    prevUser=x['user']
    prevTaskId=x['task_idx']
end        
puts "icResult count: " + icResults.size.to_s
puts "icReultsNoDups count: " + icResultsNoDups.size.to_s

# now filter by user and then sort by normalized comparison
# todo, scan results for the usernames, for now, hard coded
users = ['mike', 'paul', 'susan', 'karyn', 'pete']

# do an each loop to get all the users sorted lists
userResults = icResultsNoDups.select { |x| x['user'] == 'mike' }
puts "Mike has " + userResults.size.to_s + " results"

# sort with comparitor function


# spit out the results here


# CSV.open("results_100_rev2.csv", "w") do |csv|
  # csv << ['task_id', 'image0', 'image1', 'winner', 'user', 'date', 'icl']
# # CSV.open("results_100_rev1.csv", "w") do |csv|
# icResults.each do |x|
  # #puts "here"
  # row = Hash.new()

  # #row['task'] = x['task']
  # row['task_idx'] = x['task_idx']
  # row['image0'] = x['image0'] #.split('/').last
  # row['image1'] = x['image1'].split('/').last
  # row['winner'] = x['winner']
  # row['user'] = x['user']
  # row['date']=x['date']

  # thisUser= x['user']
  # thisTaskIdx=x['task_idx']
  # thisTask=x['task']
  # row['icl']=task2icl[thisTask]

  # thisLine="#{x['task_idx']}, #{x['image0'].split('/').last}, #{x['image1'].split('/').last}, #{x['winner']}, #{x['user']}, #{x['date']}, #{row['icl']}"

# end
# end

puts output.size

