<?php

$rootDir = __DIR__;
$search = 'VS Code';
$replace = 'HiTechAi Studio Code';

/**
 * Extension loại trừ (ảnh + binary)
 */
$excludeExt = [
    'jpg','jpeg','png','gif','webp','svg','ico','bmp','tiff',
    'mp4','mp3','avi','mov','zip','rar','7z','exe','dll','bin','pdf'
];

/**
 * Thư mục loại trừ
 */
$excludeDirs = [
    'node_modules','.git','vendor','storage','cache','logs'
];

$selfFile = realpath(__FILE__);
$changedFiles = [];

/**
 * Check text file (tránh binary)
 */
function isTextFile($file) {
    $content = @file_get_contents($file, false, null, 0, 512);
    if ($content === false) return false;

    // nếu có ký tự lạ -> coi như binary
    return !preg_match('~[^\x09\x0A\x0D\x20-\x7E]~', $content);
}

/**
 * Replace thông minh (giữ hoa/thường)
 */
function smartReplace($content, $search, $replace) {
    return preg_replace_callback(
        '/' . preg_quote($search, '/') . '/iu',
        function ($matches) use ($replace) {
            $text = $matches[0];

            if (mb_strtoupper($text) === $text) {
                return mb_strtoupper($replace);
            }

            if (mb_strtolower($text) === $text) {
                return mb_strtolower($replace);
            }

            if (ucfirst(mb_strtolower($text)) === $text) {
                return ucfirst(mb_strtolower($replace));
            }

            return $replace;
        },
        $content
    );
}

/**
 * Duyệt file
 */
$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($rootDir, RecursiveDirectoryIterator::SKIP_DOTS)
);

foreach ($iterator as $file) {
    $filePath = $file->getPathname();

    // skip chính nó
    if (realpath($filePath) === $selfFile) continue;

    // skip folder
    foreach ($excludeDirs as $dir) {
        if (strpos($filePath, DIRECTORY_SEPARATOR . $dir . DIRECTORY_SEPARATOR) !== false) {
            continue 2;
        }
    }

    $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

    // skip extension bị loại
    if (in_array($ext, $excludeExt)) continue;

    // skip binary
    if (!isTextFile($filePath)) continue;

    $content = @file_get_contents($filePath);
    if ($content === false) continue;

    if (stripos($content, $search) === false) continue;

    $newContent = smartReplace($content, $search, $replace);

    if ($newContent !== $content) {
        file_put_contents($filePath, $newContent);
        $changedFiles[] = $filePath;
        echo "✔ Updated: $filePath\n";
    }
}

echo "\nDone! Tổng file đã sửa: " . count($changedFiles) . "\n";
