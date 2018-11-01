<?php
// MongoDB 伺服器設定
$dbhost = 'jupyter.taibif.tw';
$dbname = 'mm_annotation';

// 連線到 MongoDB 伺服器
$mongoClient = new MongoClient('mongodb://' . $dbhost);
$db = $mongoClient->$dbname;

// 取得 demo 這個 collection
$cTest = $db->test;

// 要儲存的資料
$data = json_decode(file_get_contents("php://input"));
// $data = json_decode(file_get_contents("test_result_001.json"));

// 設定查詢條件
$queryCondition['url'] = $data->url;

// update options
$update_options['upsert'] = true;
//$update_options['multiple'] = true;

// 將資料upsert至 test 這個 collection 中
$cTest->update($queryCondition, $data, $update_options);

echo json_encode(array('criteria'=>$queryCondition, 'new_object' => $data, 'options' => $update_options));

?>
