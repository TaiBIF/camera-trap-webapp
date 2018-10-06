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

$queryType = 'phenology';
$queryType_base = empty($_GET['ph']) ? 'flower' : $_GET['ph'];

$queryCondition['$or'][]['tokens.description_level'] = $queryType_base;
$queryCondition['$or'][]['tokens.description_level'] = $queryType_base . '-group';
$queryCondition['$or'][]['tokens.description_level'] = $queryType_base . '-stem';
function descLvlSatisfied ($desc_lvl) {
	global $queryType_base, $queryType;
	if ($desc_lvl == $queryType_base || $desc_lvl == $queryType_base . '-group' || $desc_lvl == $queryType_base . '-stem') {
		return true;
	}
	return false;
}

$queryCondition['$or'][]['$and'][]['tokens.data.value'] = $queryType_base . 'ing';
$queryCondition['$or'][]['$and'][]['tokens.data.key'] = $queryType;
function dataSatisfied ($k, $v) {
	global $queryType_base, $queryType;
	if ($v == $queryType_base . 'ing' && $k == $queryType) {
		return true;
	}
	return false;
}


// fields to return
// $fl['url'] = 1;
// $fl['tokens.token_id'] = 1;
$fl['_id'] = 0;

// loading
$cursor = $cTest->find($queryCondition, $fl);
//$cursor = $cTest->aggregate($agg);

// iterate results
$results = array();
$req = array();
$image_scope_key_val = array();
$idv_satisfied = array();

foreach ($cursor as $res) {
	get_required_data($res['tokens'], $res);
}

$rows = array();
$cols = array();
foreach ($req as $md5_image_path => $vidv) {
	foreach ($vidv as $viid => $pack) {
		if (empty($cols)) {
			$cols = array_keys($pack);
		}
		$cells = array();
		$cells['viid'] = $viid;
		foreach ($cols as $col) {
			if (is_array($pack[$col])) {
				$cells[$col] = str_replace('NA|', '', implode("|", array_keys($pack[$col])));
				if ($cells[$col] == 'NA') {
					if (is_array(@$image_scope_key_val[$md5_image_path][$col]) && count($image_scope_key_val[$md5_image_path][$col]) == 1) {
						$cells[$col] = end(array_keys($image_scope_key_val[$md5_image_path][$col]));
					}
				}
			}
			else {
				$cells[$col] = $pack[$col];
			}
		}
		if (@$idv_satisfied[$viid]) {
			$rows[] = implode("\t", $cells);
		}
	}
}
echo "viid\t";
echo implode("\t", $cols);
echo "\n";
foreach ($rows as $row) {
	echo $row . "\n";
}

function get_required_data ($tokens, $res) {
	global $req, $queryType, $image_scope_key_val, $idv_satisfied;

	$image_scope_fields = array(
		'date',
		'locality',
		'wgs84-x',
		'wgs84-y',
	);

	$idv_scope_fields = array(
		'name-vernacular-zhtw',
		'name-scientific',
		$queryType,
	);

	$required_fields = array_merge($image_scope_fields, $idv_scope_fields);

	if (preg_match('/\.fbcdn\.net/', $res['url'])) {
		$parts = explode('?', $res['url'], 2);
		$base_url = $parts[0];
		$parts = explode(".fbcdn.net", $base_url, 2);
		$id_url = '\.fbcdn\.net' . $parts[1];
		$url = $id_url;
	}
	else {
		$url = $res['url'];
	}

	$image_scope_key_val[md5($url)] = array();

	$token_idx = array();
	$token_is_group_data = array();
	foreach ($tokens as $t) {
		// find parent group
		$token_idx[$t['token_id']] = $t;

		if (preg_match('/^group$/', $t['description_level'])) {
			foreach ($t['data'] as $d) {
				if (in_array($d['key'], $required_fields)) {
					if (!empty($d['value'])) {
						$token_is_group_data[$t['token_id']][$d['key']][$d['value']] = true;
					}
				}
			}
		}

	}

	foreach ($tokens as $t) {


		$req[md5($url)][$t['meta']['virtual_individual_id']]['url'] = $res['url'];
		$req[md5($url)][$t['meta']['virtual_individual_id']]['carrier_url'] = $res['carrier_url'];

		foreach ($required_fields as $rf) {
			if (empty($req[md5($url)][$t['meta']['virtual_individual_id']][$rf])) {
				$req[md5($url)][$t['meta']['virtual_individual_id']][$rf]['NA'] = true;
			}
		}

		$priority = false;
		foreach ($t['data'] as $d) {
			if (in_array($d['key'], $required_fields)) {
				if (dataSatisfied($d['key'], $d['value'])) {
					$priority = true;
					$idv_satisfied[$t['meta']['virtual_individual_id']] = true;
					break;
				}
			}
		}
		if ($priority) {
			foreach ($t['data'] as $d) {
				if (in_array($d['key'], $required_fields)) {
					if (!empty($d['value'])) {
						unset($req[md5($url)][$t['meta']['virtual_individual_id']][$d['key']]);
						$req[md5($url)][$t['meta']['virtual_individual_id']][$d['key']] = $d['value'];
					}
				}
			}
		}

		$priority = false;
		foreach ($t['data'] as $d) {
			if (in_array($d['key'], $required_fields)) {
				if (descLvlSatisfied($t['description_level'])) {
					$idv_satisfied[$t['meta']['virtual_individual_id']] = true;
					$priority = true;
				}
			}
		}
		if ($priority) {
			foreach ($t['data'] as $d) {
				if (in_array($d['key'], $required_fields)) {
					if (!empty($d['value'])) {
						if (is_array($req[md5($url)][$t['meta']['virtual_individual_id']][$d['key']])) {
							unset($req[md5($url)][$t['meta']['virtual_individual_id']][$d['key']]);
							$req[md5($url)][$t['meta']['virtual_individual_id']][$d['key']] = $d['value'];
						}
					}
				}
			}
		}


		foreach ($t['data'] as $d) {
			if (in_array($d['key'], $required_fields)) {
				if (is_array($req[md5($url)][$t['meta']['virtual_individual_id']][$d['key']])) {
					if (!empty($d['value'])) {
						$req[md5($url)][$t['meta']['virtual_individual_id']][$d['key']][$d['value']] = true;
					}
					else {
						$req[md5($url)][$t['meta']['virtual_individual_id']][$d['key']]['NA'] = true;
					}

				}
			}
			if (in_array($d['key'], $image_scope_fields)) {
				if (!empty($d['value'])) {
					$image_scope_key_val[md5($url)][$d['key']][$d['value']] = true;
				}
			}
		}

		$tt = $t;
		$parent_id = null;
		while (!empty($tt['meta']['parent_id']) && $parent_id != $tt['meta']['parent_id'] && !empty($token_idx[$tt['meta']['parent_id']])) {
			$parent_id = @$tt['meta']['parent_id'];
			$tt = $token_idx[$tt['meta']['parent_id']];
		}

		foreach ($t['data'] as $d) {
			if (in_array($d['key'], $required_fields)) {
				if (is_array($req[md5($url)][$t['meta']['virtual_individual_id']][$d['key']]) && count($req[md5($url)][$t['meta']['virtual_individual_id']][$d['key']]) == 1) {
					if (empty($d['value'])) {
						// find parent until group
						if (preg_match('/^group$/', $tt['description_level']) && !preg_match('/^group$/', $t['description_level'])) {
							if (!empty($token_is_group_data[$tt['token_id']][$d['key']])) {
								$req[md5($url)][$t['meta']['virtual_individual_id']][$d['key']] = $token_is_group_data[$tt['token_id']][$d['key']];
#								var_dump('WTF');
							}
						}
					}
				}
			}
		}


		$req[md5($url)][$t['meta']['virtual_individual_id']]['description_level'][$t['description_level']] = true;
		//var_dump($req[md5($url)][$t['meta']['virtual_individual_id']]);
	}


}








?>

