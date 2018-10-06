<?php
// MongoDB 伺服器設定
$dbhost = 'jupyter.taibif.tw';
$dbname = 'mm_annotation';

// 連線到 MongoDB 伺服器
$mongoClient = new MongoClient('mongodb://' . $dbhost);
$db = $mongoClient->$dbname;

// 取得 demo 這個 collection
$cTest = $db->test;

// 要load的criteria, image url
$query = json_decode(file_get_contents("php://input"));

// for debug
// $query['url'] = 'example001.png';

$url = $query->url;

// 設定查詢條件
if (preg_match('/\.fbcdn\.net/', $url)) {
	$parts = explode('?', $url, 2);
	$base_url = $parts[0];
        $parts = explode(".fbcdn.net", $base_url, 2);
	$id_url = '\.fbcdn\.net' . $parts[1];
	$queryCondition['url']['$regex'] = $id_url;
}
else {
	$queryCondition['url'] = $url;
}


// loading
$result = $cTest->findOne($queryCondition);

// return
echo json_encode(array('query' => $query, 'result' => $result));

?>
