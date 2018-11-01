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
if (!!$query) {
  $contains = $query->contains;
  $viid = @$query->viid;
  $carrier_url = @$query->carrier_url;
  $tid = $query->token_id;
}
else {
  $contains = ".*";
}


// 設定查詢條件
//$queryCondition['tokens']['$elemMatch']['data']['$elemMatch']['value']['$regex'] = $contains;
if (!empty($contains)) {
  $queryCondition['$or'][0]['tokens.data.value']['$regex'] = $contains;
  $queryCondition['$or'][1]['tokens.description_level']['$regex'] = $contains;
}

//$agg[0]['$match'] = $queryCondition;
//$agg[1]['$project']['tokens.data.byteLocation']['$indexOfBytes'] = array('$tokens.data.value', $contains);
if (!empty($viid)) {
  $queryCondition['tokens.meta.virtual_individual_id'] = $viid;
}

if (!empty($carrier_url)) {
  $queryCondition['carrier_url'] = $carrier_url;
}

if (!empty($tid)) {
  $queryCondition['tokens.relations.object']['$regex'] = $tid;
}

//$agg[1]['$project']['tokens']['$filter']['input'] = '$tokens';
//$agg[1]['$project']['tokens']['$filter']['as'] = 'token';
//$agg[1]['$project']['tokens']['$filter']['cond']['$indexOfBytes'] = array('$$token.data.value', $contains);


// fields to return
$fl['url'] = 1;
$fl['tokens.token_id'] = 1;
$fl['_id'] = 0;

// loading
$cursor = $cTest->find($queryCondition, $fl);
//$cursor = $cTest->aggregate($agg);

// iterate results
$results = array();
foreach ($cursor as $res) {
  array_push($results, $res['url']);
}

if (!$query)
  var_dump($results);

// return
echo json_encode(array('query' => $query, 'result' => $results));


?>
